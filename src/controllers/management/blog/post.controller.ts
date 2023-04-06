import moment from 'moment';

// 获取具体文章
export const getPostById = async (ctx) => {
  let id = ctx.params.id || 0,
    sql = ` SELECT post.id, post.title, post.content, post.poster, post.createTime, 
            post.categoryId, category.name AS categoryName, viewTotal 
            FROM post LEFT JOIN category ON post.categoryId = category.id 
            WHERE post.id = ${id}`,
    tagSql = `SELECT tag.id, tag.name from post_tag a LEFT JOIN tag on a.tagId = tag.id 
              WHERE a.postId = ${id}`;
  try {
    let results = await ctx.execSql(sql);
    if (results.length > 0) {
      let tagResults = await ctx.execSql(tagSql);
      ctx.body = {
        success: 1,
        message: '',
        post: results[0],
        tags: tagResults.length > 0 ? tagResults : [],
      };
    } else {
      ctx.body = {
        success: 1,
        message: '',
        post: null,
        tags: [],
      };
    }
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: 0,
      message: '查询数据出错',
    };
  }
};
// 添加文章
export const addPost = async (ctx) => {
  let postData = ctx.request.body,
    tags: [{ id?: string }] = postData.tags,
    newPost = {
      title: postData.title,
      content: postData.content,
      categoryId: postData.categoryId,
      viewTotal: 0,
      status: postData.status,
      poster: '',
      createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
  try {
    let insert = await ctx.execSql('INSERT INTO post SET ?', newPost);
    if (insert.affectedRows > 0) {
      let id = insert.insertId;
      if (tags.length > 0) {
        let updateTag = 'INSERT INTO post_tag (postId, tagId) values ';
        for (let tag of Object.values(tags)) {
          updateTag += `(${id}, ${tag.id}),`;
        }
        let tagSql = updateTag.substring(0, updateTag.length - 1);
        let insertTag = await ctx.execSql(tagSql);
      }
      ctx.body = {
        success: 1,
        id: id,
      };
    } else {
      ctx.body = {
        success: 0,
        message: '添加文章出错',
      };
    }
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: 0,
      message: '添加文章出错',
    };
  }
};
// 更新文章
export const updatePost = async (ctx) => {
  let id = ctx.params.id || 0,
    postData = ctx.request.body,
    tags: [{ id?: string }] = postData.tags,
    newPost = {
      title: postData.title,
      content: postData.content,
      categoryId: postData.categoryId,
      status: postData.status,
      poster: postData.poster,
    };
  try {
    let result = await ctx.execSql('UPDATE post SET ? WHERE id = ?', [newPost, id]);
    let delResult = await ctx.execSql('DELETE FROM post_tag WHERE postId = ?', id);
    if (tags.length > 0) {
      let updateTag = 'INSERT INTO post_tag (postId, tagId) values ';
      for (let tag of Object.values(tags)) {
        updateTag += `(${id}, ${tag.id}),`;
      }
      let tagSql = updateTag.substring(0, updateTag.length - 1);
      let insertTag = await ctx.execSql(tagSql);
    }
    ctx.body = {
      success: 1,
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: 0,
      message: '添加文章出错',
    };
  }
};
// 获取文章列表
export const getPostList = async (ctx) => {
  let { categoryId, status, page, rowsPerPage } = ctx.request.body;
  categoryId = categoryId || null;
  status = status || null;
  page = page || 1;
  rowsPerPage = rowsPerPage || 20;
  let sql = `
        SELECT post.id, post.title, post.createTime, post.status, post.categoryId, category.name AS categoryName 
        FROM post 
        LEFT JOIN category ON post.categoryId = category.id 
        WHERE (post.categoryId = ${categoryId} OR ${categoryId} IS NULL) 
        AND (post.status = ${status} OR ${status} IS NULL)
        ORDER BY post.createTime DESC 
        LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage};
  `;
  try {
    let results = await ctx.execSql(sql);
    ctx.success(ctx, results);
  } catch (error) {
    console.log(error);
    ctx.error(ctx, 402);
  }
};
// 获取文章总数
export const getPostTotal = async (ctx) => {
  try {
    let results = await ctx.execSql(`SELECT * FROM post`);
    ctx.body = {
      success: 1,
      message: '',
      total: results.length || 0,
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: 0,
      message: '查询数据出错',
      total: 0,
    };
  }
};
// 下架文章
export const offlinePost = async (ctx) => {
  let id = ctx.params.id || 0;
  try {
    let results = await ctx.execSql(`UPDATE post SET status = 'OFFLINE' WHERE id = ?`, id);
    ctx.body = {
      success: 1,
      message: '',
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: 0,
      message: '文章下线出错',
    };
  }
};
// 发布文章
export const publishPost = async (ctx) => {
  let id = ctx.params.id || 0;
  try {
    let results = await ctx.execSql(`UPDATE post SET status = 'PUBLISHED' WHERE id = ?`, id);
    ctx.body = {
      success: 1,
      message: '',
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: 0,
      message: '文章发布出错',
    };
  }
};
// 删除文章
export const deletePost = async (ctx) => {
  let id = ctx.params.id || 0;
  try {
    let results = await ctx.execSql(`DELETE FROM post WHERE id = ?`, id);
    ctx.body = {
      success: 1,
      message: '',
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      success: 0,
      message: '文章删除出错',
    };
  }
};