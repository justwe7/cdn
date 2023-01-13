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

### 使用方法
1. 
https://cdn.jsdelivr.net/gh/justwe7/cdn/images/2020/03/11/image.png
