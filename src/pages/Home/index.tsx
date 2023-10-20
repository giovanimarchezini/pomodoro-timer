import { HandPalm, Play } from 'phosphor-react'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { useContext } from 'react'
import { NeWCycleForm } from './components/NewCycleForm'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { CyclesContext } from '../../contexts/CyclesContext'
import { Countdown } from './components/Countdown'

const newCycleFormValidateSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})
type NewCycleFormData = zod.infer<typeof newCycleFormValidateSchema>

export function Home() {
  const { createNewCycle, InterruptCurrentCycle, activeCycle } =
    useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidateSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NeWCycleForm />
        </FormProvider>
        <Countdown />
        {!activeCycle ? (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={20} />
            Começar
          </StartCountdownButton>
        ) : (
          <StopCountdownButton type="button" onClick={InterruptCurrentCycle}>
            <HandPalm size={20} />
            Interromper
          </StopCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
