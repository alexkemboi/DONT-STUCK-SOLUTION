import { getBankDetailsAction, getClientAddressAction, getClientByUserId, getLatestEmploymentAction, getRefereesAction } from '@/app/actions/client'
import { ProfileClient } from '@/components/client/profile/profile-client'

import React, { Suspense } from 'react'

const page = async() => {
    const [addresses, client, employment, referees, bankDetails] = await Promise.all([
        getClientAddressAction(),
        getClientByUserId(),
        getLatestEmploymentAction(),
        getRefereesAction(),
        getBankDetailsAction()
    ])

    console.log({bankDetails});
    console.log({referees});
    console.log({employment});
    console.log({addresses});
    console.log({client});

   return (
      <main className="min-h-screen bg-background">
          <div className="container w-full mx-auto px-4 py-8">
            <Suspense >
                   <ProfileClient
                       bankDetailsSource={bankDetails || null}
                       refereesSource={referees.data || []}
                    //    employmentSource={employment || null}
                       addressSource={addresses?.data?.[0] || null}
                       clientSource={client || null}
                   />
            </Suspense>
             
          </div>
      </main>
  )
}

export default page