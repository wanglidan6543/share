# git commit 规范

标签（空格分隔）： git

---
## 1. 用什么规范？
>现在市面上比较流行的方案是约定式提交规范（Conventional Commits），它受到了Angular提交准则的启发，并在很大程度上以其为依据。约定式提交规范是一种基于提交消息的轻量级约定。 它提供了一组用于创建清晰的提交历史的简单规则；这使得编写基于规范的自动化工具变得更容易。这个约定与SemVer相吻合，在提交信息中描述新特性、bug 修复和破坏性变更。它的 message 格式如下:
```
<类型>[可选的作用域]: <描述>

[可选的正文]

```
## 2. 编写commmit message的工具
### 2.1 要装的两个包
>commitizen 一个撰写合格commit message的工具
>cz-conventional-changelog 适配器，提供conventional-changelog标准（约定式提交标准）。基于不同需求，也可以使用不同适配器。
### 2.2 全局安装
#### 2.2.1  安装 commitizen
```
npm install -g commitizen
```
#### 2.2.2  安装适配器
```
commitizen init cz-conventional-changelog --save-dev --save-exact
```
>该命令做了3件事
(1)安装cz-conventional-changelog 适配器 (2)将cz-conventional-changelog 保存到package.json devDependencies
(3) 在packjson.json中添加了以下配置

```
"config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
```
#### 2.2.3 使用
> 可以直接使用git cz 代替  git commit 

### 2.3 项目内部安装
#### 2.3.1 安装commitizen
```
npm install --save-dev commitizen
```
#### 2.3.2 安装适配器
```
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```
#### 2.3.3 使用
>npx git-cz
>如果觉得 npx git-cz 命令麻烦，可以在package.json 里面配置以下命令
```
"scripts": {
    "cm": "git-cz"
    }
```
## 3. commit 验证
#### 3.1 安装 三 个包
```
npm i -D husky @commitlint/config-conventional @commitlint/cli
```
>1. commitlint 负责用于对commit message进行格式校验
>2. husky  责提供更易用的git hook。
#### 3.2 配置commitlint
>项目根目录创建 commitlint.config.js,里面添加以下代码
```
module.exports = {extends: ["@commitlint/config-conventional"]};
```
#### 3.3 配置 husky
>package.json 里面添加
```
 "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }  
  }
```
### 3.4 到此配置全部完成
>配置完成后 还是可以使用git commit -m "message"命令，只是会对message的格式做验证，如果格式不正确 会阻止提交
> 如果要直接使用git commit -m "message" 这种命令，需要注意message的格式
```
<类型><:><空格><短描述>
```
## 4. 使用
>type为必填项，用于指定commit的类型，约定了feat、fix两个主要type，以及docs、style、build、refactor、revert五个特殊type，其余type暂不使用。
### 4.1 type(必填)
```
# 主要type
feat:     增加新功能
fix:      修复bug

# 特殊type
docs:     只改动了文档相关的内容
style:    不影响代码含义的改动，例如去掉空格、改变缩进、增删分号
build:    构造工具的或者外部依赖的改动，例如webpack，npm
refactor: 代码重构时使用
revert:   执行git revert打印的message

# 暂不使用type
test:     添加测试或者修改现有测试
perf:     提高性能的改动
ci:       与CI（持续集成服务）有关的改动
chore:    不修改src或者test的其余修改，例如构建过程或辅助工具的变动
```
### 4.2 scope
>用于描述改动的范围
### 4.3 short description (必填)
>对当前commit的简短描述
### 4.4 longer description
>详细描述
### 4.4 break changes
>break changes指明是否产生了破坏性修改
### 4.5 affect issues
>affect issues指明是否影响了某个问题

## 5. 参考文章
http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html
https://zhuanlan.zhihu.com/p/69989048https://zhuanlan.zhihu.com/p/69989048