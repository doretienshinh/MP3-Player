
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'MP3_PLAYER'

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const btnNext = $('.btn-next');
const btnPrev = $('.btn-prev');
const btnRandom = $('.btn-random');
const btnRepeat = $('.btn-repeat');
const playlist = $('.playlist');

const app = {

    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "3107",
            singer: "W n (Official Video) ft. Nâu, Duongg",
            path: "./assets/music/3107 - W n (Official Video) ft. Nâu, Duongg.mp3",
            image: "./assets/img/music1-3107.png"
        },
        {
            name: "Chuyện Đôi Ta",
            singer: "Emcee L (Da LAB) ft Muộii",
            path: "./assets/music/Chuyện Đôi Ta - Emcee L (Da LAB) ft Muộii (Official MV).mp3",
            image: "./assets/img/music2-chuyendoita.jpg"
        },
        {
            name: "Có lẽ em đã khóc rất nhiều",
            singer: "Thắc Mắc (Lo-fi ver by Hawys)",
            path: "./assets/music/Có lẽ em đã khóc rất nhiều. - Thắc Mắc (Lo-fi ver by Hawys).mp3",
            image: "./assets/img/music3-thacmac.jpg"
        },
        {
            name: "Forget Me Now",
            singer: "fishy & Trí Dũng",
            path: "./assets/music/fishy & Trí Dũng - Forget Me Now.mp3",
            image: "./assets/img/music4-fgmn.jpg"
        },
        {
            name: "hoi em yeu dau",
            singer: "lofi",
            path: "./assets/music/hoi em yeu dau.mp3",
            image: "./assets/img/music5-hoiemyeudau.jpg"
        },
        {
            name: "Loi Noi Doi Chan That",
            singer: "JustaTee",
            path: "./assets/music/Loi Noi Doi Chan That.mp3",
            image: "./assets/img/music6-lndct.jpg"
        },
        {
            name: "Love08",
            singer: "DuongG x OD x Tinkerbell",
            path: "./assets/music/Love08 DuongG x OD x Tinkerbell OFFICIAL MV.mp3",
            image: "./assets/img/music7-l08.jpg"
        },
        // {
        //     name: "3107",
        //     singer: "W n (Official Video) ft. Nâu, Duongg",
        //     path: "./assets/music/3107 - W n (Official Video) ft. Nâu, Duongg.mp3",
        //     image: "./assets/img/music1-3107.png"
        // },
        // {
        //     name: "Chuyện Đôi Ta",
        //     singer: "Emcee L (Da LAB) ft Muộii",
        //     path: "./assets/music/Chuyện Đôi Ta - Emcee L (Da LAB) ft Muộii (Official MV).mp3",
        //     image: "./assets/img/music2-chuyendoita.jpg"
        // },
        // {
        //     name: "Có lẽ em đã khóc rất nhiều",
        //     singer: "Thắc Mắc (Lo-fi ver by Hawys)",
        //     path: "./assets/music/Có lẽ em đã khóc rất nhiều. - Thắc Mắc (Lo-fi ver by Hawys).mp3",
        //     image: "./assets/img/music3-thacmac.jpg"
        // },
        // {
        //     name: "Forget Me Now",
        //     singer: "fishy & Trí Dũng",
        //     path: "./assets/music/fishy & Trí Dũng - Forget Me Now.mp3",
        //     image: "./assets/img/music4-fgmn.jpg"
        // },
        // {
        //     name: "hoi em yeu dau",
        //     singer: "lofi",
        //     path: "./assets/music/hoi em yeu dau.mp3",
        //     image: "./assets/img/music5-hoiemyeudau.jpg"
        // },
        // {
        //     name: "Loi Noi Doi Chan That",
        //     singer: "JustaTee",
        //     path: "./assets/music/Loi Noi Doi Chan That.mp3",
        //     image: "./assets/img/music6-lndct.jpg"
        // },
        // {
        //     name: "Love08",
        //     singer: "DuongG x OD x Tinkerbell",
        //     path: "./assets/music/Love08 DuongG x OD x Tinkerbell OFFICIAL MV.mp3",
        //     image: "./assets/img/music7-l08.jpg"
        // },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })

        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth;
        // Xử lý phóng to thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.screenY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop > 0 ? cdWidth - scrollTop : 0;

            cd.style.width = newCdWidth + 'px';
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // CD Rotate

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //Xử lý khi play

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }
        // Next Song
        btnNext.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.nextSong()
            }
            audio.play()

            _this.render()

            _this.scrollActiveSong()
        }
        // Prev Song
        btnPrev.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.prevSong()
            }
            audio.play()

            _this.render()

            _this.scrollActiveSong()
        }
        // Khi play

        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Chạy progress
        audio.ontimeupdate = function () {
            if (audio.duration) {
                progress.value = Math.floor(audio.currentTime / audio.duration * 100)
            }
        }
        //Xử lý khi tua
        progress.oninput = function (e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        // Random click event
        btnRandom.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom);
            btnRandom.classList.toggle('active', _this.isRandom)
        }

        // Repeat click event
        btnRepeat.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat);
            btnRepeat.classList.toggle('active', _this.isRepeat)
        }
        // Next khi hết song
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            }
            else btnNext.click()
        }
        // Click vào bài hát

        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {

                if (e.target.closest('.option')) {
                    console.log(e.target.closest('.option'))
                    return true;
                }

                // Xử lý click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

            }
        }
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    nextSong: function () {
        if (this.currentIndex++ >= this.songs.length - 1) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        if (this.currentIndex-- <= 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    loadCurrentSong: function () {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    scrollActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                blocked: 'nearest'
            })
        }, 300)
    },
    start: function () {
        //Load config
        this.loadConfig();
        //Định nghĩa các thuộc tính cho obj
        this.defineProperties();
        //Lắng nghe / xử lý các sự kiện 
        this.handleEvents();
        //Tải thông tin bài hát đầu tiên
        this.loadCurrentSong();
        // Render playlist
        this.render();

        // Hiển thị config
        btnRandom.classList.toggle('active', this.isRandom)

        btnRepeat.classList.toggle('active', this.isRepeat)
    }

}

app.start()


