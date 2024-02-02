import { createAction, option } from '@typebot.io/forge'
import { got } from 'got'
import { ATENDIMENTO_URL } from '..'
import { auth } from '../auth'
import { baseOptions } from '../baseOptions'

export const editConversationStatus = createAction({
  auth,
  name: 'Alterar Status da Conversa',
  options: option.object({
    status: option.enum(['open', 'resolved', 'pending', 'snoozed']).layout({
      defaultValue: 'open',
      label: 'Status',
    }),
  }),
  baseOptions,
  run: {
    server: async ({
      credentials: { token, accountID },
      options: { status, conversationId },
      logs,
    }) => {
      if (!token) {
        logs.add({
          status: 'error',
          description: 'o TOKEN está vazio',
        })
        throw new Error('o TOKEN está vazio')
      }

      if (!conversationId) {
        logs.add({
          status: 'error',
          description: 'o conversationID está vazio',
        })
        throw new Error('o conversationID está vazio')
      }
      const options = {
        headers: {
          api_access_token: token,
        },
        json: {
          status: status,
        },
      }
      let result = await got
        .post(
          `${ATENDIMENTO_URL}/api/v1/accounts/${accountID}/conversations/${conversationId}/toggle_status`,
          options
        )
        .json()
    },
  },
})
