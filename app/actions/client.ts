"use server"

import { auth } from "@/lib/auth";
import { BankDetail, Client, ClientAddress, EmploymentDetail, Referee } from "@/lib/types";
import { headers } from "next/headers";
import { createAddress, createBankDetail, createClientService, createEmployment, createReferee, deleteReferee, getAddresses, getBankDetails, getLatestEmployment, getReferees, updateAddress, updateClient, updateEmployment, updateReferee } from "@/services/client.service";
import prisma from "@/lib/prisma";
import { fileToInput, uploadFile } from "@/services/storage.service";



interface ClientResponse {
    id?: string;
    userId?: string | null;
    title?: Client["title"] |undefined;
    surname?: string;
    otherNames?: string;
    dateOfBirth?: Date;
    maritalStatus?: Client["maritalStatus"];
    status?: Client["status"];
    createdAt?: Date;
    updatedAt?: Date;
}


export async function getClientByUserId(): Promise<{ success: boolean; data?: ClientResponse; error?:string}> {
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        }); 

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const userId = session.user.id as string;
        
        const client = await prisma.client.findUnique({
            where: {
                userId: userId
            }
        });

        if(!client){
            return { success: false, error: "Client not found" };
        }

        return {
            success: true, 
            data: {
                ...client,
                dateOfBirth: client.dateOfBirth ? new Date(client.dateOfBirth) : new Date(),
                createdAt: client.createdAt ? new Date(client.createdAt) : new Date(),
                updatedAt: client.updatedAt ? new Date(client.updatedAt) : new Date(),
            }
        };

    }catch(error){
        return { success: false, error: (error as Error).message };
    }
}
export async function updateClientAction(id: string, data: Partial<Client>): Promise<{ success: boolean; data?: ClientResponse; error?:string}> {      
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session?.user) {
            throw new Error("Unauthorized");
        }
        let payload: any = {
            ...data
        }
        if(data.dateOfBirth){
            payload.dateOfBirth = new Date(data.dateOfBirth);
        }
        const updatedClient = await updateClient(id, payload);

        await prisma.auditLog.create({
            data: {
                userId: session.user.id as string,
                action: "UPDATE",
                entity: "Client",
                entityId: id,
                newValue: payload as object,
            },
        }).catch(() => {});

        return {
            success: true,
            data: {
                ...updatedClient.data,
                dateOfBirth: updatedClient?.data?.dateOfBirth ? new Date(updatedClient.data.dateOfBirth) : new Date(),
                createdAt: updatedClient?.data?.createdAt ? new Date(updatedClient.data.createdAt) : new Date(),
                updatedAt: updatedClient?.data?.updatedAt ? new Date(updatedClient.data.updatedAt) : new Date(),
            }
        };
    }catch(error){
        return { success: false, error: (error as Error).message };
    }
}

export async function createClientAction(data: Client): Promise<{ success: boolean; data?: ClientResponse; error?:string}> {
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        }); 

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        let payload = {
            ...data,
            userId: session.user.id as string,
            dateOfBirth: new Date(data.dateOfBirth)
        }

        const newClient = await createClientService(payload);

        await prisma.auditLog.create({
            data: {
                userId: session.user.id as string,
                action: "CREATE",
                entity: "Client",
                entityId: newClient.data?.id,
                newValue: { surname: data.surname, otherNames: data.otherNames },
            },
        }).catch(() => {});

        return {
            success: true, data: newClient.data
        };

    }catch(error){
        return { success: false, error: (error as Error).message };
    }
}



export async function getClientAddressAction(): Promise<{ success: boolean; data?: ClientAddress[]; error?:string}> {
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        }); 

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        // fetch client id of the logged in user
        const client = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            select:{
                client:true
            }
        });

        if(!client){
            throw new Error("Client not found");
        }
        
        const addresses = await getAddresses(client.client?.id as string);

        if (!addresses.success) {
            throw new Error(addresses.error || "Failed to retrieve addresses");
        }

        return {
            success: true, 
            data: addresses.data && addresses.data.length > 0 ? addresses.data : []
        };

    }catch(error){
        return { success: false, error: (error as Error).message };
    }
}


export async function updateAddressAction(params: { id: string; data: Partial<ClientAddress> }) {
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const updatedAddress = await updateAddress(params.id, params.data);
        if (!updatedAddress.success) {
            throw new Error(updatedAddress.error || "Failed to update address");
        }

        await prisma.auditLog.create({
            data: {
                userId: session.user.id as string,
                action: "UPDATE",
                entity: "ClientAddress",
                entityId: params.id,
                newValue: params.data as object,
            },
        }).catch(() => {});

        return {
            success: true,
            data: updatedAddress.data
        };
    }catch(error){
        return { success: false, error: (error as Error).message };
    }
}

export async function createClientAddressAction(data:ClientAddress) {
        try{
            const session = await auth.api.getSession({
                headers: await headers()
            }); 

            if (!session?.user) {
                throw new Error("Unauthorized");
            }

            // fetch client id of the logged in user
            const client = await prisma.user.findUnique({
                where: { id: session.user.id as string },
                select:{
                    client:true
                }
            });





            if(!client){
                throw new Error("Client not found");
            }
            

            let payload = {
                ...data
            }

            const newAddress = await createAddress(client.client?.id as string, payload);

            await prisma.auditLog.create({
                data: {
                    userId: session.user.id as string,
                    action: "CREATE",
                    entity: "ClientAddress",
                    entityId: newAddress.data?.id,
                    newValue: payload as object,
                },
            }).catch(() => {});

            return {
                success: true,
                data: newAddress.data
            };

        }   catch(error){
            return { success: false, error: (error as Error).message };
        }
}



export async function getLatestEmploymentAction() {
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        }); 

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        // fetch client id of the logged in user
        const client = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            select:{
                client:true
            }
        });

        if(!client){
            throw new Error("Client not found");
        }
        
        const employment = await getLatestEmployment(client.client?.id as string);
        return { success: true, data: employment };
    }catch (error) {
        return { success: false,  error: (error as Error).message };
    }
    
}

export async function createEmploymentDetailAction(data:EmploymentDetail) {
    // Implementation for creating employment detail
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        }); 

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        // fetch client id of the logged in user
        const client = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            select:{
                client:true
            }
        });

        if(!client){
            throw new Error("Client not found");
        }
        

        let payload = {
            ...data,
            dateJoined: data.dateJoined ? new Date(data.dateJoined) : undefined,
            contractExpiry: data.contractExpiry ? new Date(data.contractExpiry) : undefined,
        }

        const newEmployment = await createEmployment(client.client?.id as string, payload);

        await prisma.auditLog.create({
            data: {
                userId: session.user.id as string,
                action: "CREATE",
                entity: "EmploymentDetail",
                entityId: newEmployment.data?.id,
                newValue: { employerName: data.employerName, jobTitle: data.jobTitle, employmentType: data.employmentType },
            },
        }).catch(() => {});

        return {
            success: true,
            data: newEmployment.data
        };

    }catch(error){
        return { success: false, error: (error as Error).message };
    }
}


export async function updateEmploymentDetailAction(id:string, data:Partial<EmploymentDetail>) {
    // Implementation for updating employment detail
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        let payload = {
            ...data,
            dateJoined: data.dateJoined ? new Date(data.dateJoined) : undefined,
            contractExpiry: data.contractExpiry ? new Date(data.contractExpiry) : undefined,
        }
        delete payload.id

        const updatedEmployment = await updateEmployment(id, payload);
        if (!updatedEmployment.success) {
            throw new Error(updatedEmployment.error || "Failed to update employment detail");
        }

        await prisma.auditLog.create({
            data: {
                userId: session.user.id as string,
                action: "UPDATE",
                entity: "EmploymentDetail",
                entityId: id,
                newValue: payload as object,
            },
        }).catch(() => {});

        return {
            success: true,
            data: updatedEmployment.data
        };
    }catch(error){
        return { success: false, error: (error as Error).message };
    }
}

export async function getRefereesAction(): Promise<{ success: boolean; data?: any[]; error?:string}> {
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        }); 

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        // fetch client id of the logged in user
        const client = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            select:{
                client:true
            }
        });

        if(!client){
            throw new Error("Client not found");
        }
        
        const referees = await getReferees(client.client?.id as string);

        if (!referees.success) {
            throw new Error(referees.error || "Failed to retrieve referees");
        }

        return {
            success: true, 
            data: referees.data && referees.data.length > 0 ? referees.data : []
        };

    }catch(error){
        return { success: false, error: (error as Error).message };
    }
}


export async function createRefereeAction(data:Referee) {
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        }); 

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        // fetch client id of the logged in user
        const client = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            select:{
                client:true
            }
        });

        if(!client){
            throw new Error("Client not found");
        }

        const newReferee = await createReferee(client.client?.id as string, data);

        await prisma.auditLog.create({
            data: {
                userId: session.user.id as string,
                action: "CREATE",
                entity: "Referee",
                entityId: newReferee.data?.id,
                newValue: { surname: data.surname, otherNames: data.otherNames, phoneMobile: data.phoneMobile },
            },
        }).catch(() => {});

        return {
            success: true,
            data: newReferee.data
        };

    }catch(error){
        return { success: false, error: (error as Error).message };
    }
}


export async function updateRefereeAction(refereeId: string, data: Partial<Referee>) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        // fetch client id of the logged in user
        const client = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            select: {
                client: true
            }
        });

        if (!client) {
            throw new Error("Client not found");
        }
        let payload = {
            ...data
        }

        const newReferee = await updateReferee(refereeId as string, payload);

        await prisma.auditLog.create({
            data: {
                userId: session.user.id as string,
                action: "UPDATE",
                entity: "Referee",
                entityId: refereeId,
                newValue: payload as object,
            },
        }).catch(() => {});

        return {
            success: true,
            data: newReferee.data
        };

    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}


export async function deleteRefereeAction(refereeId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        // fetch client id of the logged in user
        const client = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            select: {
                client: true
            }
        });

        if (!client) {
            throw new Error("Client not found");
        }

        const response = await deleteReferee(refereeId);

        await prisma.auditLog.create({
            data: {
                userId: session.user.id as string,
                action: "DELETE",
                entity: "Referee",
                entityId: refereeId,
            },
        }).catch(() => {});

        return {
            success: response.success
        };

    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}


export async function getBankDetailsAction(): Promise<{ success: boolean; data?: any; error?:string}> {
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        }); 

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        // fetch client id of the logged in user
        const client = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            select:{
                client:true
            }
        });

        if(!client){
            throw new Error("Client not found");
        }
        
        const bankDetail = await getBankDetails(client.client?.id as string);

        return {
            success: true, 
            data: bankDetail.data
        };

    }catch(error){
        return { success: false, error: (error as Error).message };
    }
}

export async function createBankAction(data:BankDetail) {
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        }); 

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        // fetch client id of the logged in user
        const client = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            select:{
                client:true
            }
        });

        if(!client){
            throw new Error("Client not found");
        }

        let payload = {
            ...data,
            clientId:client.client?.id as string
        }

        const newBankDetail = await createBankDetail(client.client?.id as string, payload);

        await prisma.auditLog.create({
            data: {
                userId: session.user.id as string,
                action: "CREATE",
                entity: "BankDetail",
                entityId: newBankDetail.data?.id,
                newValue: { bankName: data.bankName, accountNumber: data.accountNumber },
            },
        }).catch(() => {});

        return {
            success: true,
            data: newBankDetail.data
        };

    }catch(error){
        return { success: false, error: (error as Error).message };
    }
}


export async function uploadBankDocumentAction(formData: FormData): Promise<{ success: boolean; data?: { url: string }; error?: string }> {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const file = formData.get("file") as File;
        if (!file) {
            throw new Error("No file provided");
        }

        const fileInput = await fileToInput(file);
        const uploadResult = await uploadFile(fileInput, "bank-documents");

        if (!uploadResult.success || !uploadResult.data) {
            throw new Error(uploadResult.error || "File upload failed");
        }

        await prisma.auditLog.create({
            data: {
                userId: session.user.id as string,
                action: "UPLOAD",
                entity: "BankDocument",
                newValue: { fileName: file.name, fileSize: file.size },
            },
        }).catch(() => {});

        return {
            success: true,
            data: {
                url: uploadResult.data.secureUrl
            }
        };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}