# a2bei4类库介绍
## 一些业务无关通用方法，挂在utils下
整理收集一些基础性的JS方法，例如：判断数据类型、获取GUID、防抖、节流等，具体介绍你可以查看……
### 获取数据的类型
### 获取一个GUID
### 获取函数形参的名称
### 获取指定范围内的一个随机整数
### 获取一个随机汉字
### 获取一个随机英文字母
### 获取指定长度的由随机汉字英文字母组成的字符串
### 防抖
### 节流
### 数值扩展方法：洗牌算法
### 数值扩展方法：根据数组索引交换位置
## 一些日期（Date）扩展方法方法，挂在date下
### 转日期
### 判断是不是日期
### 日期格式化
### 获取指定范围内的一个时间
## 一些节点（Node）扩展方法方法，挂在node下
### 获取指定节点的前一个节点
### 获取指定节点的后一个节点
### 在指定节点的前面插入一个节点
### 在指定节点的后面插入一个节点
### 判断是否是空白空格文本节点
### 判断是否是空文本节点
## 事件派发器
简单的事件派发器，支持监听、触发、销毁（可以传方法和唯一标识）；支持同源不同页面之间的通信
## ID生成器
基于时间戳的ID生成器，同一客户端生成唯一有序ID，不同客户端之间唯一ID……