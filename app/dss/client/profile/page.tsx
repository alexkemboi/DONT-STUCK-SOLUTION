export const dynamic = "force-dynamic";
import { getClientAddressAction, getClientByUserId, getLatestEmploymentAction, getRefereesAction } from '@/app/actions/client'
import { ProfileClient } from '@/components/client/profile/profile-client'

import React, { Suspense } from 'react'

const page = async() => {
    const [addresses, client, employment, referees] = await Promise.all([
        getClientAddressAction(),
        getClientByUserId(),
        getLatestEmploymentAction(),
        getRefereesAction(),
    ])

    // console.log({bankDetails});
    // console.log({referees});
    // console.log({employment});
    // console.log(addresses.data);
    console.log({client});

   return (
      <main className="min-h-screen bg-background">
          <div className="container w-full mx-auto px-4 py-8">
            <Suspense >
                   <ProfileClient
                       refereesSource={referees?.data || []}
                       employmentSource={
                           employment?.data
                               ? {
                                   ...employment.data?.data,
                                   netSalary: employment.data?.data?.netSalary?.toNumber()
                               }
                               : null
                       }
                       addressSource={addresses?.data?.[0]  || null}
                       clientSource={client?.data  || null}
                   />
            </Suspense>
             
          </div>
      </main>
  )
}

export default page