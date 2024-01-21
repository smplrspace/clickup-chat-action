import * as core from '@actions/core'

const CLICKUP_TOKEN = core.getInput('CLICKUP_TOKEN')
const LIST_ID = core.getInput('LIST_ID')
const MESSAGE = core.getInput('MESSAGE')
const CLICKUP_API = 'https://api.clickup.com/api/v2/list'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export const run = async (): Promise<void> => {
  try {
    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())

    const body = JSON.stringify({
      name: MESSAGE,
      description: MESSAGE,
      markdown_description: MESSAGE,
      assignees: [49309403],
      status: 'OPEN',
      priority: 2,
      due_date: new Date().valueOf(),
      due_date_time: false,
      time_estimate: 8640000,
      start_date: Date.now() - 2 * 60 * 60 * 1000,
      start_date_time: false
    })

    console.log(body)

    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', CLICKUP_TOKEN)

    let response = await fetch(`${CLICKUP_API}/${LIST_ID}/task`, {
      method: 'POST',
      headers: headers,
      body
    })

    response = await response.json()
    console.log(response)

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
