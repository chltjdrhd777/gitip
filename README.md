<h1 align="center"><strong>gitip</strong></h1>

<p> A handy tool to create github issue & pull request using command line</p>

<img src="https://github.com/chltjdrhd777/image-hosting/blob/main/gitip.png?raw=true" title="title"></img>

## Before start

<h4>📋 1. This tool works with remote-fork branch relationships</h4>

- please make the fork branch first.

<h4>📋 2. Before you start, you have to set the environment values on ".env.${NODE_ENV}"</h4>

![env-file](https://github.com/chltjdrhd777/image-hosting/blob/main/gitip-envs.jpeg?raw=true)

<br/>

```bash
// <<required varibales>>

// Basically it uses an env file according to a "NODE_ENV" varibale.
// If your environment is "development", then gitip uses the target env file.
// If there isn't, a default file is ".env"

GIT_ACCESS_TOKEN = git access token.
REMOTE_REPO_OWNER = the name of remote branch owner
FORK_REPO_OWNER = the name of fork branch owner
REPO_NAME = the repository name;
BRANCH_NAME = the base(destination) branch name
TEMPLATE_TITLE_PLACEHOLDER = (optional) issue template title placeholder
```

<h4>📋 3. This tool uses issue templete. If there isn't, it show the default issue template</h4>

<img src="https://github.com/chltjdrhd777/image-hosting/blob/main/gitip-issuetemplate.png?raw=true" width="100%" title="template"></img>

If you want to use your template, you should set the `TEMPLATE_TITLE_PLACEHOLDER` varibale on you .env file. It will uses that variable as an issue title placeholder.

<br/>

## usage

### 🖊️ 1. create an issue

![auto-issue](https://github.com/chltjdrhd777/image-hosting/blob/main/create-issue.gif?raw=true)

<img src="https://github.com/chltjdrhd777/image-hosting/blob/main/auto-issue.png?raw=true" title="create-issue-3"></img>

<img src="https://github.com/chltjdrhd777/image-hosting/blob/main/create-issue2.png?raw=true" title="create-issue-3"></img>

### 🖊️ 2. create a pull request

First of all, you need to commit your change

<img src="https://github.com/chltjdrhd777/image-hosting/blob/main/issue%20commit.png?raw=true" title="create-pr-1"></img>

And, just select "create a pull request"

- the title of a pull request comes from the latest commit
- the body of a pull request comes from the latest commit either
- If the pull request closed, it would close the issue together

![auto-pr](https://github.com/chltjdrhd777/image-hosting/blob/main/auto-pr.gif?raw=true)
![pr-result](https://github.com/chltjdrhd777/image-hosting/blob/main/pr.png?raw=true)

<br/>

> ⚠️ Caveat<br/>
> If you want to use "close" keyword to close related issue together, the base(destination) branch should be a default branch

![default-branch](https://github.com/chltjdrhd777/image-hosting/blob/main/gitip-default-branch.png?raw=true)

### 🖊️ 3. Synchronize a fork branch with origin branch

If you need to update your fork branch whenever origin is updated, you can do it without visiting to your fork branch manually

> 😩 Not this

![sync-unrecommanded](https://github.com/chltjdrhd777/image-hosting/blob/main/sync.png?raw=true)

> 😀 But this

![sync-recommended](https://github.com/chltjdrhd777/image-hosting/blob/main/sync2.gif?raw=true)

### 🖊️ 4. Remove unused issue branches

When you are using gitip, maybe you would face the situation that there are bunch of redundant issue branches like below

#### 1. 😩 local debris

![local-issue-debirs](https://github.com/chltjdrhd777/image-hosting/blob/main/issue-debris-from-local.png?raw=true)

#### 2. 😩 fork debris

![local-issue-debirs](https://github.com/chltjdrhd777/image-hosting/blob/main/issue-debris-from-fork.png?raw=true)

If you should remove the unused branches, it takes time and effort. <br/>
So, for you, you can remove them all at once like below

#### 4. 😀 like this

![clean-issue-branches](https://github.com/chltjdrhd777/image-hosting/blob/main/clean%20issue%20branches.gif?raw=true)

As a result, you meat the erased clean space

![issue-clean](https://github.com/chltjdrhd777/image-hosting/blob/main/issue-clean.png?raw=true)
