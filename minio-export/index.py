import os

from minio import Minio

MINIO_CONFIG = {
    "url": "192.168.124.40:9000",
    "access_key": "qrCX3RbPTSoryHikrxeI",
    "secret_key": "dfe4EJ5h5ca7mppvqL7l1gmuEcFbRLFO72200fbC",
    "secure": False,
    "bucket_name": "blog-service-oss"
}
minio_client = Minio(
    MINIO_CONFIG['url'],
    access_key=MINIO_CONFIG['access_key'],
    secret_key=MINIO_CONFIG['secret_key'],
    secure=MINIO_CONFIG['secure'],
)
# 目标目录
target_directory = "./blog-service-oss"

# 创建目标目录，如果不存在
if not os.path.exists(target_directory):
    os.makedirs(target_directory)

# 遍历存储桶中的所有对象
objects = minio_client.list_objects(MINIO_CONFIG['bucket_name'], recursive=True)

for obj in objects:
    # 对象的目标路径
    target_path = os.path.join(target_directory, obj.object_name)

    # 创建对象所在的目录（如果不存在）
    if not os.path.exists(os.path.dirname(target_path)):
        os.makedirs(os.path.dirname(target_path))

    # 下载对象到目标路径
    minio_client.fget_object(MINIO_CONFIG['bucket_name'], obj.object_name, target_path)
    print(f"Downloaded {obj.object_name} to {target_path}")

print("All files have been downloaded.")
