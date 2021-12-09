let app = new Vue({
	el: "#app",
	data() {
		return {
			form_data: {
				query: ""
			},
			result_data: [],
			page_info: {
			  current_page: 1,
			  total_page: 2,
			  page_size: 5,
			  page_data: {
			  	"pg1":[],
			  	"pg2":[]
			  }
			},
			current_data:[],
			jump_index: 1
		}
	},
	methods: {
		search_video() {
			if(this.form_data.query.trim(" ") === "") {
				alert("キーワードをご入力ください。")
				return;
			}
			this.current_data = []
			axios.get("http://10.167.162.170/video?query=" + this.form_data.query).then(res => {
				for(let index in res.data) {
					res.data[index]["display_start_time"] = this.convert_time(res.data[index].start_time);
					res.data[index]["display_end_time"] = this.convert_time(res.data[index].end_time)
				}
				this.result_data = res.data;
				this.do_page()
			}).catch(err => {
				console.log(err)
			})
		},
		// 時間変換
		convert_time(time_str) {
			let result = parseFloat(time_str)
			let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
			let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
			let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
			let sss = Math.floor((result * 1000 % 1000));
			sss = sss < 10 ? '00' + sss : sss < 100 ? '0' + sss : sss;
			return result = h + ":" + m + ":" + s + "." + sss;
		},
		init_video(item) {
			document.getElementById(item.similarity_score).currentTime = item.start_time;
		},
		download (item) {
			document.getElementById("a_" + item.similarity_score).click();
		},
		do_page() {
			this.page_info["current_page"] = 1;
			this.page_info["page_size"] = 6;
			this.page_info["total_page"] = this.result_data.length % this.page_info["page_size"] === 0? Math.floor(this.result_data.length / this.page_info["page_size"]):Math.floor(this.result_data.length / this.page_info["page_size"]) + 1;
			this.page_info["page_data"] = {};
			for (let page = 1; page <= this.page_info["total_page"];page++)
				this.page_info["page_data"]["pg" + page] = [];
			for (let index in this.result_data){
				let belong_page = Math.floor(index / this.page_info["page_size"])+1;
				this.page_info["page_data"]["pg" + belong_page].push(this.result_data[index])
			}
			this.current_data = this.page_info["page_data"]["pg" + this.page_info["current_page"]]
			this.jump_index = this.page_info["current_page"];
		},
		pre () {
			if (this.page_info["current_page"] > 1)
				this.page_info["current_page"]--;
			this.current_data = this.page_info["page_data"]["pg" + this.page_info["current_page"]]
			this.jump_index = this.page_info["current_page"];
		},
		next () {
			if (this.page_info["current_page"] < this.page_info["total_page"])
				this.page_info["current_page"]++;
			this.current_data = this.page_info["page_data"]["pg" + this.page_info["current_page"]]
			this.jump_index = this.page_info["current_page"];
		},
		jump () {
			if (this.jump_index != ""){
				if (this.jump_index <= this.page_info["total_page"] && this.jump_index > 0) {
					this.page_info["current_page"] = this.jump_index;
					this.current_data = this.page_info["page_data"]["pg" + this.page_info["current_page"]];
				}
			} else {
				this.jump_index = parseInt(this.page_info["current_page"]);
			}
		}
		
	}
})
