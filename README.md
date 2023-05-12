# aphelios

```sql
CREATE TABLE sm_board_comments (
  id VARCHAR(32) PRIMARY KEY,
  article_id VARCHAR(32),
  user_id VARCHAR(32),
  parent_id VARCHAR(32),
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  likes INT NOT NULL DEFAULT 0,
  dislikes INT NOT NULL DEFAULT 0,
  reports INT NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'visible', -- 评论的状态，如：visible, hidden, deleted
  reply_count INT NOT NULL DEFAULT 0 -- 评论的回复数
)
```
