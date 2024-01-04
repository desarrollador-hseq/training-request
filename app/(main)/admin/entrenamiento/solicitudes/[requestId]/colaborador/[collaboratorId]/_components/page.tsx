

import Link from 'next/link'
import React from 'react'
import { AdminScheduleCollaboratorForm } from './admin-schedule-collaborator-form'
import { db } from '@/lib/db';

const AdminRequestCollaboratorPage = async ({
  params,
}: {
  params: { requestId: string; collaboratorId: string };
}) => {

  const trainingRequestCollaborator = await db.trainingRequestCollaborator.findUnique({
    where: {
      collaboratorId_trainingRequestId: {
        collaboratorId: params.collaboratorId,
        trainingRequestId: params.requestId
      }
    }
  })

  console.log({trainingRequestCollaborator})


  
  return (
    <div>
        <AdminScheduleCollaboratorForm />
    </div>
  )
}

export default AdminRequestCollaboratorPage