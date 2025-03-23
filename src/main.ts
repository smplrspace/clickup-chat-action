import * as core from '@actions/core'
import * as github from '@actions/github'
import { formatEvent } from './eventFormatter'

const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN
const workspaceId = core.getInput('workspace-id')
const channelId = core.getInput('channel-id')

const clickupBaseUrl = `https://api.clickup.com/api/v3/workspaces/${workspaceId}`
const createMessageApi = `/chat/channels/${channelId}/messages`

interface StatusOption {
  status: string
  emoji: string // replace by color banner of ClickUp API lets us in future
}

const statuses: Record<string, StatusOption> = {
  success: {
    status: 'Success',
    emoji: '🟢'
  },
  failure: {
    status: 'Failure',
    emoji: '🔴'
  },
  cancelled: {
    status: 'Cancelled',
    emoji: '🟠'
  }
}

const allowedStatuses = Object.keys(statuses)

// main function
export const run = async (): Promise<void> => {
  if (!CLICKUP_TOKEN) {
    console.error('Missing CLICKUP_TOKEN env')
    return
  }

  let contentLines: string[] = []

  // start with input message
  if (core.getInput('message')) {
    contentLines.push(core.getInput('message'))
  }

  // build automated status update
  if (
    core.getInput('status-update') === 'true' &&
    allowedStatuses.includes(core.getInput('status'))
  ) {
    const ctx = github.context
    const { owner, repo } = ctx.repo
    const { eventName, ref, workflow, payload, serverUrl, runId } = ctx
    const repoURL = `${serverUrl}/${owner}/${repo}`
    const workflowURL = `${repoURL}/actions/runs/${runId}`
    const refName = ref
      .replace('refs/tags/', '')
      .replace('refs/heads/', '')
      .replace('refs/pull/', '')
      .replace('owner/repo/.github/', '')

    contentLines = contentLines.concat([
      `${statuses[core.getInput('status')].emoji} ${statuses[core.getInput('status')].status}: ${workflow} \`${refName}\``,
      `${formatEvent(eventName, payload)}`,
      `[Workflow](${workflowURL})`
    ])
  }

  console.log(`🤖 Posting message to ClickUp:\n${contentLines.join('\n')}`)

  try {
    const body = JSON.stringify({
      type: 'message',
      content_format: 'text/md',
      content: contentLines.join('\n')
    })

    const headers = new Headers()
    headers.append('Accept', 'application/json')
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', CLICKUP_TOKEN)

    const response = await fetch(`${clickupBaseUrl}${createMessageApi}`, {
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
  console.log('🤖 Done posting')
  return
}
