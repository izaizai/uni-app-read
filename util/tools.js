//工具函数库，仔仔编写。

let _tool = {
	//获取书架数据
	async GetBookListData() {
		try {
		    const value = uni.getStorageSync('bookshelf_list');
		    if (value) {
				return value;
		    }
		} catch (e) {
		    return '';
		}
	},
	//加入到书架
	async AddBookListData(data) {
		let BookList = await this.GetBookListData();
		if(BookList == "" || BookList == null || BookList == undefined) {
			let newArr = [];
			newArr.push(data);
			await this.AddBookListStorage(newArr);
		} else {
			let BookID = await this.GetBookListID(data.id);
			if(BookID==false) {
				BookList.push(data);
				await this.AddBookListStorage(BookList);
			}
		}
	},
	//更新书架信息
	async UpBookListData(data) {
		let BookList = await this.GetBookListData();
		if(BookList == "" || BookList == null || BookList == undefined) {
			console.log('书架没有内容');
		} else {
			let BookID = false;
			for (let i = 0; i < BookList.length; i++)
			{
				if(BookList[i].id == data.id) {
					BookList[i].news = data.news;
					BookList[i].page = data.page;
					BookList[i].index = data.index;
					BookList[i].name = data.name;
					BookID = true;
				}
			}
			if(BookID) {
				await this.AddBookListStorage(BookList);
			}
		}
	},
	//加入到书架数据
	async AddBookListStorage(data) {
		try {
		    uni.setStorageSync('bookshelf_list', data);
		} catch (e) {
		    // error
		}
	},
	//书架中是否已经存在
	async GetBookListID(BookID) {
		let BookList = await this.GetBookListData();
		if(BookList == "" || BookList == null || BookList == undefined) {
			return false;
		} else {
			let state = false;
			for (let i = 0; i < BookList.length; i++)
			{
				if(BookList[i].id == BookID) {
					state = true;
				}
			}
			return state;
		}
	},
	//删除书籍
	async DelBookList(BookID) {
		let BookList = await this.GetBookListData();
		if(BookList == "" || BookList == null || BookList == undefined) {
			return false;
		} else {
			let newArr = [];
			for (let i = 0; i < BookList.length; i++)
			{
				if(BookID.includes(BookList[i].id)==false) {
					newArr.push(BookList[i]);
				}
			}
			await this.AddBookListStorage(newArr);
		}
	},
	//清理缓存
	async clearStorage() {
		try {
			uni.setStorageSync('bookshelf_list', '');
		    uni.clearStorageSync();
		} catch (e) {
		    // error
		}
	},
	//获取书籍内容
	async GetReadContentData(SourceCode) {
		uni.showLoading({title: '处理中...'});
		let Content = await this.GetInterceptTheSpecifiedString(SourceCode,'<div id="book_text">','<div id="ali"></div>');
		uni.hideLoading();
		return Content;
	},
	//详情数据
	async DetailsData(SourceCode) {
		uni.showLoading({title: '处理中...'});
		let DetailsArr = {};
		let BookCode = await this.GetInterceptTheSpecifiedString(SourceCode,'<div id="maininfo">','<div class="ob-first"></div></div>');
		let img = await this.GetInterceptTheSpecifiedString(BookCode,'<div class="img"><img src="','" width="200" height="240" alt="');
		let name = await this.GetInterceptTheSpecifiedString(BookCode,'<h1>','</h1>');
		let author = await this.GetInterceptTheSpecifiedString(BookCode,'<h3>作者：','</h3>');
		let sort = await this.GetInterceptTheSpecifiedString(BookCode,'<p>所属类型：','</p>');
		let state = await this.GetInterceptTheSpecifiedString(BookCode,'<p>连载完成：','</p>');
		let time = await this.GetInterceptTheSpecifiedString(BookCode,'<p class="s">更新时间：','</p>');
		let news = await this.GetInterceptTheSpecifiedString(BookCode,'target="_blank">','</a></span>');
		let introView = await this.GetInterceptTheSpecifiedString(BookCode,'<div id="intro">','</div>');
		let intro = await this.GetInterceptTheSpecifiedString(introView,'<p>','</p>');
		
		let newData = {img:img,name:name,author:author,sort:sort,intro:intro,state:state,time:time,news:news};
		//console.log(newData);
		DetailsArr.data = newData;
		
		let ListCode = await this.GetInterceptTheSpecifiedString(SourceCode,'<div class="article_texttitleb">','<div class="tags"><b>');
		let ListView = await this.GetInterceptTheSpecifiedString(ListCode,'<ul>','</ul>');
		let liArr = ListView.split("</li>");
		let NewArr = [];
		for (let i = 0; i < liArr.length; i++)
		{
			if(liArr[i]) {
				let idView = await this.GetInterceptTheSpecifiedString(liArr[i],'<a href="/dingdian/','">');
				if(idView) {
					let id = await this.GetInterceptTheSpecifiedString(idView,'/','.html');
					let name = await this.GetInterceptTheSpecifiedString(liArr[i],'.html">','</a>');
					let newJson = {id:id,name:name};
					//console.log(newJson);
					NewArr.push(newJson);
				}
			}
		}
		DetailsArr.list = NewArr;
		uni.hideLoading();
		return DetailsArr;
	},
	//搜索结果数据
	async searchData(SourceCode) {
		uni.showLoading({title: '处理中...'});
		let liCode = await this.GetInterceptTheSpecifiedString(SourceCode,'<ul id="BookList" class="nr">','</ul>');
		let liArr = liCode.split("</li>");
		let searchArr = [];
		for (let i = 0; i < liArr.length; i++)
		{
			if(liArr[i]) {
				let id = await this.GetInterceptTheSpecifiedString(liArr[i],'<div class="pic"><a href="/dingdian/','/"  target=');
				if(id) {
					let img = await this.GetInterceptTheSpecifiedString(liArr[i],'<img src="','" ></a>');
					let nameView = await this.GetInterceptTheSpecifiedString(liArr[i],'<div class="nrrk">','<div class="num"></div>');
					let name = await this.GetInterceptTheSpecifiedString(nameView,'"  target="_blank">','</a></strong>');
					let author = await this.GetInterceptTheSpecifiedString(nameView,'<span>作者：','</span></div>');
					let sort = await this.GetInterceptTheSpecifiedString(nameView,'<span>类别：','</span><span>');
					let introduceView = await this.GetInterceptTheSpecifiedString(liArr[i],'<div class="num"></div>',' <dl><dt>');
					let introduce = await this.GetInterceptTheSpecifiedString(introduceView,'<p>','</p>');
					let newJson = {id:id,img:img,name:name,author:author,sort:sort,introduce:introduce};
					console.log(newJson);
					searchArr.push(newJson);
				}
			}
		}
		uni.hideLoading();
		return searchArr;
	},
	//截取指定字符串
	async GetInterceptTheSpecifiedString(str,firstStr,secondStr){
	   if(str == "" || str == null || str == undefined){ // "",null,undefined
	       return "";
	   }
	   if(str.indexOf(firstStr)<0){
	        return "";
	   }
	   var subFirstStr=str.substring(str.indexOf(firstStr)+firstStr.length,str.length);
	   var subSecondStr=subFirstStr.substring(0,subFirstStr.indexOf(secondStr));
	   return subSecondStr;
	},
	//获取字符串的真实长度（字节长度）
	strLeng(str) {
		if(str) {
			let len = str.length, truelen = 0;
			for(let x = 0; x < len; x++) {
				if(str.charCodeAt(x) > 128){
					truelen += 2;
				}else{
					truelen += 1;
				}
			}
			return truelen;
		} else {
			return 0;
		}
	}
};

export default _tool;