<div align="center"><strong>gitip</strong></div>
<div align="center">handy create issue & pull request tool</div>
<br />

![title](https://github.com/chltjdrhd777/image-hosting/blob/main/gitip.png?raw=true)

## Instructions

📋 This tool works with remote-fork branch relationships

> please make the fork branch first.
> <br/>

---

📋 Before you start, you have to set the environment values on ".env.${NODE_ENV}"
![env-file](https://github.com/chltjdrhd777/image-hosting/blob/main/gitip-envs.jpeg?raw=true)

> Basically it uses an env file according to a "NODE_ENV" varibale.<br/> If your environment is "development", then gitip uses the target env file.<br/>
> If there isn't, a default file is ".env"
> <br/>

```bash
// required varibales
GIT_ACCESS_TOKEN = git access token.
REMOTE_REPO_OWNER = the name of remote branch owner
FORK_REPO_OWNER = the name of fork branch owner
REPO_NAME = the repository name;
BRANCH_NAME = the base(destination) branch name
TEMPLATE_TITLE_PLACEHOLDER = (optional) issue template title placeholder
```

---

📋 This tool uses issue templete. If there isn't, it show the default issue template
![issue-template](https://github.com/chltjdrhd777/image-hosting/blob/main/gitip-issuetemplate.png?raw=true)
![issue-list](https://github.com/chltjdrhd777/image-hosting/blob/main/gitip-issuelist.png?raw=true)

> If you want to use template, you should set the `TEMPLATE_TITLE_PLACEHOLDER` varibale on you .env file. It will uses that variable as an issue title placeholder.

## <br/>

## usage

### 1. create an issue

![issue-generation-test](https://github.com/chltjdrhd777/image-hosting/blob/main/issue-generation-test2.png?raw=true)

![issue-generation-test-result](https://github.com/chltjdrhd777/image-hosting/blob/main/issue-generation-test-result.png?raw=true)

![issue-generation-checkout](https://github.com/chltjdrhd777/image-hosting/blob/main/issue-generation-checkout.png?raw=true)

---

### 2. create a pull request

> First of all, you need to commit your change

![pr-generation-0](https://github.com/chltjdrhd777/image-hosting/blob/main/pr-generation0.png?raw=true)

> And, just select "create a pull request"<br/>
>
> - the title of a pull request is the latest commit
> - the body of a pull request comes from the latest commit either
> - If that pull request closed, it would close the issue together

![pr-generation-1](https://github.com/chltjdrhd777/image-hosting/blob/main/pr-generation1.png?raw=true)

![pr-generation-result](https://github.com/chltjdrhd777/image-hosting/blob/main/pr-generation-result.png?raw=true)

> ⚠️ Caveat<br/>
> If you want to use "close" keyword, the base(destination) branch should be a default branch

![default-branch](https://github.com/chltjdrhd777/image-hosting/blob/main/gitip-default-branch.png?raw=true)
