# GitHub action wrapping the ClickUp chat API

Forked from [BaharaJr/clickup](https://github.com/BaharaJr/clickup) that had a
pretty good setup.

## Inputs

- `WORKSPACE_ID` - **Required**. ClickUp workspace ID.
- `CHANNEL_ID` - **Required**. ClickUp chat channel ID.
- `MESSAGE` - **Required**. Message to post to the chat channel. This supports
  markdown formatting.

## Environment variables

- `CLICKUP_TOKEN` - **Required**. Your ClickUp token. See the
  [ClickUp API docs](https://developer.clickup.com/docs/authentication) for
  details.

## Example

To apply migrations with the Hasura CLI:

```yaml
name: Your workflow
on:
  push:
    branches:
      - main
jobs:
  your_workflow:
    name: Your workflow
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v4
      # - all the steps of your workflow
      - name: Post about it on ClickUp chat
        uses: smplrspace/clickup-chat-action@v1
        with:
          WORKSPACE_ID: YOUR_WORKSPACE_ID
          CHANNEL_ID: YOUR_CHAT_CHANNEL_ID
          MESSAGE: Can read this? The clickup-chat-action seems to work... 🎉
        env:
          CLICKUP_TOKEN: ${{ secrets.CLICKUP_TOKEN }}
```

## Publishing a new release (for maintainers)

This project includes a helper script designed to streamline the process of
tagging and pushing new releases for GitHub Actions.

GitHub Actions allows users to select a specific version of the action to use,
based on release tags. Our script simplifies this process by performing the
following steps:

1. **Retrieving the latest release tag:** The script starts by fetching the most
   recent release tag by looking at the local data available in your repository.
1. **Prompting for a new release tag:** The user is then prompted to enter a new
   release tag. To assist with this, the script displays the latest release tag
   and provides a regular expression to validate the format of the new tag.
1. **Tagging the new release:** Once a valid new tag is entered, the script tags
   the new release.
1. **Pushing the new tag to the remote:** Finally, the script pushes the new tag
   to the remote repository. From here, you will need to create a new release in
   GitHub and users can easily reference the new tag in their workflows.
