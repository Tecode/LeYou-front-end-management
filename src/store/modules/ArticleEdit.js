import {
	ARTICLE_INPUT,
	ARTICLE_CHOICE_TYPE,
	ARTICLE_SAVE,
	THUMBNAIL_SAVE,
	GET_ARTICLE,
	GET_ARTICLE_DA,
	RESET_ARTICLE_STORE
} from '../actionTypes'
import Image from '../../imgs/no_image.jpg';
import {
	saveArticelApi,
	getArticleApi,
	updateArticelApi
} from '../../api';

import Router from 'vue-router';
const routre = new Router();


const ArticleEdit = {
	state: {
		aid: '',
		title: '',
		articleType: '',
		author: '',
		keyWords: '',
		discript: '',
		updateImage: '69',
		content: '<p></p>'
	},
	mutations: {
		[ARTICLE_INPUT](state, {target}) {
			state[target.id] = target.value;
		},
		[ARTICLE_CHOICE_TYPE](state, value) {
			state.articleType = value;
		},
		[THUMBNAIL_SAVE](state, url) {
			state.updateImage = url;
		},
		[GET_ARTICLE_DA](state, data) {
			state.aid = data.article_id;
			state.title = data.article_title;
			state.articleType = data.article_type;
			state.author = data.article_author;
			state.keyWords = data.article_keywords;
			state.discript = data.article_discript;
			state.updateImage = data.article_imageurl;
			state.content = data.article_content;
			window.editor.txt.append(data.article_content);
		},
		[RESET_ARTICLE_STORE](state) {
			state.aid = '';
			state.title = '';
			state.articleType = '';
			state.author = '';
			state.keyWords = '';
			state.discript = '';
			state.updateImage = '';
			state.content = '<p></p>';
		}
	},
	actions: {
		[ARTICLE_SAVE]({state, commit, rootState}, fn){
			if (state.title.length === 0) {
				commit('OPEN_DIALOG', {
					title: '错误提示',
					content: '文章标题不能为空！',
					button: false,
					multiple: false,
					timer: 3000
				})
			} else if (state.articleType === '') {
				commit('OPEN_DIALOG', {
					title: '错误提示',
					content: '文章分类不能为空！',
					button: false,
					multiple: false,
					timer: 3000
				})
			} else if (state.author === '') {
				commit('OPEN_DIALOG', {
					title: '错误提示',
					content: '文章作者不能为空！',
					button: false,
					multiple: false,
					timer: 3000
				})
			} else if (state.keyWords === '') {
				commit('OPEN_DIALOG', {
					title: '错误提示',
					content: '请填写关键词！',
					button: false,
					multiple: false,
					timer: 3000
				})
			} else if (state.discript === '') {
				commit('OPEN_DIALOG', {
					title: '错误提示',
					content: '文章描述不能为空！',
					button: false,
					multiple: false,
					timer: 3000
				})
			} else if (fn() === '<p><br></p>') {
				commit('OPEN_DIALOG', {
					title: '错误提示',
					content: '文章内容不能为空！',
					button: false,
					multiple: false,
					timer: 3000
				})
			} else {
				if (state.aid === '') {
					saveArticelApi({
						title: state.title,
						articleType: state.articleType,
						author: state.author,
						keyWords: state.keyWords,
						discript: state.discript,
						updateImage: state.updateImage,
						content: fn(),
					})
					.then(((response) => {
						commit('OPEN_DIALOG', {
							title: '保存成功',
							content: response.data.msg,
							button: false,
							multiple: false,
							timer: 3000
						});
						// 返回文章列表页
						setTimeout(() => {
							window.location.href = '/articlelist';
						}, 2000)
					}))
					.catch((err) => {
						commit('OPEN_DIALOG', {
							title: '错误提示',
							content: err.response.data.msg,
							button: false,
							multiple: false,
							timer: 3000
						})
					})
				} else {
					updateArticelApi(
					state.aid,
					{
						title: state.title,
						articleType: state.articleType,
						author: state.author,
						keyWords: state.keyWords,
						discript: state.discript,
						updateImage: state.updateImage,
						content: fn(),
					})
					.then(((response) => {
						commit('OPEN_DIALOG', {
							title: '操作成功',
							content: response.data.msg,
							button: false,
							multiple: false,
							timer: 3000
						});
						// 返回文章列表页
						setTimeout(() => {
							window.location.href = '/articlelist';
						}, 2000)
					}))
					.catch((err) => {
						commit('OPEN_DIALOG', {
							title: '错误提示',
							content: err.response.data.msg,
							button: false,
							multiple: false,
							timer: 3000
						})
					})
				}
			}
		},
		[GET_ARTICLE]({state, commit, rootState}, id){
			getArticleApi(id)
			.then((response) => {
				commit('GET_ARTICLE_DA', response.data.data);
			}).catch((err) => {
				commit('OPEN_DIALOG', {
					title: '错误提示',
					content: err.response.data.msg,
					button: false,
					multiple: false,
					timer: 3000
				})
			})
		}
	}
};

export default ArticleEdit;