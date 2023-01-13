## jsdelivr cdn加速仓库

### 如何访问资源
当前目录结构为：
```bash
.
├── README.md
├── images
│   ├── pic1.jpg
│   └── pic2.png
```
> jsdelivr的访问规则为 https://cdn.jsdelivr.net/gh/github用户名/仓库名@发布的版本号/文件路径
> 其中版本号为release的tag，非必传，不传则为最新的

当前仓库 `baseUrl` 为固定的 `https://cdn.jsdelivr.net/gh/justwe7/cdn/`

访问资源的拼接规则为`baseUrl`+`仓库文件路径`

比如访问`pic1.png`，全链接为`https://cdn.jsdelivr.net/gh/justwe7/cdn/images/pic1.jpg`

### 如何新增
1. 将本地文件提交到远端仓库
2. 点击仓库右侧`Releases -> draft a new release -> 选择tag(没有新增一个如1.0)`
3. 点击`publish release`
4. 稍等一会即可访问，markdown引入图片直接通过 `![image](https://cdn.jsdelivr.net/gh/justwe7/cdn/images/2020/03/11/image.png)` 即可生效

### 其他事项
> // 加载任何Github发布、提交或分支
> https://cdn.jsdelivr.net/gh/user/repo@version/file
> 
> // 加载 jQuery v3.2.1
> https://cdn.jsdelivr.net/gh/jquery/jquery@3.2.1/dist/jquery.min.js
> 
> // 使用版本范围而不是特定版本
> https://cdn.jsdelivr.net/gh/jquery/jquery@3.2/dist/jquery.min.js   https://cdn.jsdelivr.net/gh/jquery/jquery@3/dist/jquery.min.js
>  
> // 完全省略该版本以获取最新版本
> https://cdn.jsdelivr.net/gh/jquery/jquery/dist/jquery.min.js
>  
> // 将“.min”添加到任何JS/CSS文件中以获取缩小版本，如果不存在，将为会自动生成
> https://cdn.jsdelivr.net/gh/jquery/jquery@3.2.1/src/core.min.js
> 
> // 在末尾添加 / 以获取资源目录列表
> https://cdn.jsdelivr.net/gh/jquery/jquery/
