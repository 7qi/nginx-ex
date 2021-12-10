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
//			axios.get("http://10.167.162.170/video?query=" + this.form_data.query).then(res => {
//				for(let index in res.data) {
//					res.data[index]["display_start_time"] = this.convert_time(res.data[index].start_time);
//					res.data[index]["display_end_time"] = this.convert_time(res.data[index].end_time)
//				}
//				this.result_data = res.data;
//			}).catch(err => {
//				console.log(err)
//			})

			this.result_data = []
			data = [
			    {
			        "start_time": "5.30",
			        "end_time": "10.30",
			        "videoid": "1",
			        "similarity_score": "0.26117",
			        "peak_frame": "589"
			    },
			    {
			        "start_time": "15.00",
			        "end_time": "20.65",
			        "videoid": "1",
			        "similarity_score": "0.26095",
			        "peak_frame": "589"
			    },
			    {
			        "start_time": "60.00",
			        "end_time": "100.32",
			        "videoid": "1",
			        "similarity_score": "0.25877",
			        "peak_frame": "589"
			    },
			    {
			        "start_time": "5.30",
			        "end_time": "10.30",
			        "videoid": "1",
			        "similarity_score": "0.25095",
			        "peak_frame": "589"
			    },
			    {
			        "start_time": "5.30",
			        "end_time": "10.30",
			        "videoid": "1",
			        "similarity_score": "0.24117",
			        "peak_frame": "589"
			    },
			    {
			        "start_time": "15.00",
			        "end_time": "20.65",
			        "videoid": "1",
			        "similarity_score": "0.23095",
			        "peak_frame": "589"
			    },
			    {
			        "start_time": "60.00",
			        "end_time": "100.32",
			        "videoid": "1",
			        "similarity_score": "0.22877",
			        "peak_frame": "589"
			    },
			    {
			        "start_time": "5.30",
			        "end_time": "10.30",
			        "videoid": "1",
			        "similarity_score": "0.21095",
			        "peak_frame": "589"
			    }
			]
			for(let index in data) {
				data[index]["display_start_time"] = this.convert_time(data[index].start_time);
				data[index]["display_end_time"] = this.convert_time(data[index].end_time)
			}
			this.result_data = data;
			this.do_page();

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
		init_video(item, index) {
			//					document.getElementById(item.similarity_score).currentTime = item.start_time;
			//					
			this.result_data[index]["display_start_time"] = this.convert_time(item.start_time);
			this.result_data[index]["display_end_time"] = this.convert_time(item.end_time);
			//					console.log(this.result_data[index]["display_end_time"])
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
	},
	mounted() {
		for(let index in this.result_data) {
			this.result_data[index]["display_start_time"] = this.convert_time(this.result_data[index].start_time);
			this.result_data[index]["display_end_time"] = this.convert_time(this.result_data[index].end_time)
		}
		this.do_page();
	}
})
