<template>
  <div id="Album">
    <!--<tl-album></tl-album>-->
    <tl-aaa></tl-aaa>
  </div>
</template>

<script>
  import Request from '@/request'
  // import AlbumComp from '@/components/album/Album'
  export default {
    name: "Album",
    data(){
      return {
        albumId : this.$route.params.albumId,
        aaa :"",
        albumInfo : null
      }
    },
    mounted() {
      this.initAlbumInfo();
    },
    methods: {
      initAlbumInfo() {
        Request.getAlbumInfo(this.albumId,(data)=>{
          this.albumInfo = data.albumInfo;
        },(data)=>{

        })
      }
    },
    components :{
    }
  }
</script>

<style scoped>

</style>
