import concurrent.futures
import subprocess

# 定义要执行的Python文件列表
python_files = [
    "get-bss-help-async.py",
    "get-ceshi-async.py",
    "get-fangchan-async.py",
    "get-hot-global-async.py",
    "get-hot-ten-async.py",
    "get-jiating-async.py",
    "get-licai-async.py",
    "get-qiche-async.py",
    "get-qinzi-async.py",
    "get-tekuai-async.py",
    "get-tulan-async.py",
    "get-xinshou-async.py",
    "get-yuanchuang-async.py",
]

# 创建线程池
with concurrent.futures.ThreadPoolExecutor() as executor:
    # 将每个Python文件的执行任务分配给不同的线程
    futures = [executor.submit(subprocess.Popen, ["python", f]) for f in python_files]

    # 等待所有线程完成
    for future in concurrent.futures.as_completed(futures):
        # 获取线程执行的结果
        result = future.result()

        # 处理线程的执行结果，例如输出日志或错误信息
        print(result)
