import * as core from '@actions/core'

const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN
const WORKSPACE_ID = core.getInput('WORKSPACE_ID')
const CHANNEL_ID = core.getInput('CHANNEL_ID')
const MESSAGE = core.getInput('MESSAGE')

const CLICKUP_BASEURL = `https://api.clickup.com/api/v3/workspaces/${WORKSPACE_ID}`
const CREATE_MESSAGE_API = `/chat/channels/${CHANNEL_ID}/messages`

export const run = async (): Promise<void> => {
  if (!CLICKUP_TOKEN) {
    console.error('Missing CLICKUP_TOKEN env');
    return
  }

  console.log(`
    🤖 Posting message to clickup:
    ${MESSAGE}
  `)
  
  try {
    const body = JSON.stringify({
      type: 'message',
      content_format: 'text/md',
      content: MESSAGE
    })

    const headers = new Headers()
    headers.append('Accept', 'application/json')
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', CLICKUP_TOKEN)

    const response = await fetch(`${CLICKUP_BASEURL}${CREATE_MESSAGE_API}`, {
      method: 'POST',
      headers: headers,
      body
    })
    const res = await response.json()
    if (res.err) {
      console.log(`🚫 Error posting the message: ${res.err}`)
    }
    // set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error: any) {
    console.log(`🚫 Task failed with error : ${error?.message}`)
    // // fail the workflow run if an error occurs
    // if (error instanceof Error) {
    //   core.setFailed(error.message)
    // }
  }
  return
}
