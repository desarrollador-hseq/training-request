


import React from 'react'
import { CreateTrainingForm } from './_components/create-training-form'
import { db } from '@/lib/db'

const CreateTrainingPage = async () => {

  const courses = await db.course.findMany({where: {active: true}})


  return (
    <div>
      <CreateTrainingForm courses={courses} />
    </div>
  )
}

export default CreateTrainingPage