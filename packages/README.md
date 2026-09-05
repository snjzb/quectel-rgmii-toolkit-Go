# 离线安装包

[下载 SimpleAdmin-Go-offline.zip](SimpleAdmin-Go-offline.zip)

完整解压后进入 `SimpleAdmin-Go`，双击 `toolkit.bat` 安装。包内包含 ADB 及 DLL、已编译的 ARMv7 程序、最新网页、Windows 模拟程序、源码、许可证和图文说明，无需在安装前编译。

源码提交：`5eceaef`。此包包含从其他页面刷新后返回总览时监控卡片不更新的修复。

ARMv7 与 Windows amd64 程序均使用 Go 1.26.3 重新构建，关闭 CGO，使用 `-buildvcs=false -trimpath -ldflags '-s -w'`。本次仅修改独立加载的网页和测试，重编译后二进制与此前产物一致；更新网页后修复生效。

## SHA-256

```text
1452e82f4ee1a1e82f3435264c1a17abba43a9df6d2fb9c799cf2d7426afed48  SimpleAdmin-Go-offline.zip
198a6958465f68d50e9375fe4692e98b00979da92d6e435a97afd2fb0e3a0339  development/simpleadmin/simpleadmin-httpd.armv7
6cb1d537de615656a6f03d5d10ab8e308c46d2b7636e7c8320071326bd1687b7  windows-test/bin/simpleadmin-httpd-windows-amd64.exe
```

校验已通过：ZIP 完整性检查、包内程序与重编译产物比对、包内监控脚本与修复源码比对。
