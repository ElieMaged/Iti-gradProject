<script setup>
import EndCard from '../components/EndCard.vue';
</script>


<template>
    <!-- //About-1// -->
  <div class="">
      <div class="contact-1 m-5">
        <div class="blur"></div>
        <h1 class="text-center flex flex-row justify-center h1">{{ $t('aboutUsTitle') }}</h1>
    </div>
  </div>
  <div class="flex flex-col md:flex-row m-5 col-span-6">
      <div class="m-5">
        <h1>{{ $t('whoAreWeTitle') }}</h1>
<p>{{ $t('whoAreWeDesc') }}</p>
<br>
<br>
<br>
<br>
<h2>{{ $t('ourMissionTitle') }}</h2>
<p>{{ $t('ourMissionDesc') }}</p>
    </div>

<img class="collage-all" src="../assets/Contact/collageall.png" alt="">

          <div class="flex flex-col md:mr-3 col-span-3">

    </div>
  </div>
  <!-- About-2 -->
   <div class="container flex flex-col md:flex-row gap-10 md:gap-15 text-center about-2">
    <h2 class="accolades md:pr-5">{{ $t('teamMembers') }}</h2>
    <h2 class="accolades md:pr-5">{{ $t('winningAwards') }}</h2>
    <h2 class="accolades md:pr-5">{{ $t('completeProjects') }}</h2>
    <h2 class="accolades noBorders">{{ $t('clientReviews') }}</h2>
   </div>
   <!-- About-3 -->
    <div class="mt-20 mb-20">
   <h1 class="text-center">{{ $t('whyChooseUsTitle') }}</h1>
   </div>
   <div class="flex flex-row m-20">
       <!-- card   -->
<div class="flex flex-col md:flex-row md:m-15">
    <div class="bg-white max-w-sm overflow-hidden rounded-md flex-col-3 border-1 w-100 m-1">
   <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
</svg>
    <br>
    <br>
    <br>
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">{{ $t('cleanWorkAllTime') }}</div>
    <p class="text-gray-700 text-base">
      {{ $t('cleanWorkAllTimeDesc') }}
      <a href="">{{ $t('getStarted') }}</a>
    </p>
 
  </div>
  
</div>
    <div class="bg-white max-w-sm overflow-hidden rounded-md flex-col-3 border-1 w-100 m-1">
   <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
</svg>
    <br>
    <br>
    <br>
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">{{ $t('cleanWorkAllTime') }}</div>

    <p class="text-gray-700 text-base">
      {{ $t('cleanWorkAllTimeDesc') }}
         <a href="">{{ $t('getStarted') }}</a>
    </p>
 
  </div>
  
</div>
<div class="bg-white max-w-sm overflow-hidden rounded-md flex-col-3 border-1 w-100 m-1">
   <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
</svg>
    <br>
    <br>
    <br>
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">{{ $t('cleanWorkAllTime') }}</div>

    <p class="text-gray-700 text-base">
      {{ $t('cleanWorkAllTimeDesc') }}
         <a href="">{{ $t('getStarted') }}</a>
    </p>
 
  </div>
  
</div>
<div class="bg-white max-w-sm overflow-hidden rounded-md flex-col-3 border-1 w-100 m-1">
   <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
</svg>
    <br>
    <br>
    <br>
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">{{ $t('cleanWorkAllTime') }}</div>

    <p class="text-gray-700 text-base">
      {{ $t('cleanWorkAllTimeDesc') }}
         <a href="">{{ $t('getStarted') }}</a>
    </p>
 
  </div>
  
</div>
</div>
<div>
</div>
</div>
<EndCard />
<!-- <div class="flex flex-col justify-center end md:m-20 align-items-center">
<h2 class="h1">We're Here to Help You.</h2>
<p>We’re here to help you achieve your goals, overcome challenges and make every step smoother along the way.</p>
<button class="buttony text-white font-bold py-2 px-4 rounded-full">
  Book an Appointment ->
</button>
</div> -->

   
   
</template>


<style scoped>
img {
  width: 60rem;
  height: 20rem;
  border-radius: 1rem;
}
.bg-white {
  background: var(--secondary-bg) !important;
}
.dark .bg-white {
  background: var(--secondary-bg) !important;
}
.text-gray-700 {
  color: var(--primary-text) !important;
}
.dark .text-gray-700 {
  color: var(--primary-text) !important;
}
.dark .accolades {
  color: var(--primary-text) !important;
}


.contact-1 {
  background-image: url('../assets/Contact/aboutUs.jpg');
  filter: blur(.3px);
  display:flex;
  align-items: center;
  justify-content: center;
  height:20rem;
  color: white;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif ;
  font-size: 100rem;
  border-radius: 2rem;
}
.accolades {
    border-right: solid rgb(255, 255, 255) .1rem;
    margin-top:2rem;
    margin-bottom:2rem;
}
.dark .accolades {
  color: var(--primary-text) !important;
}

.noBorders {
    border:0rem;
}
.collage-all {
  background-color: var(--primary-bg) !important;
}
.dark .collage-all {
  background-color: var(--primary-bg) !important;
}

.about-2 {
    background-color: #FAE084;
    border-radius: 1rem;
}
.dark .about-2 {
    background-color: var(--secondary-bg) !important;
    color: var(--primary-text) !important;
} 


.collage-all {
    width:300rem;
    height:100%;
}
/* .end {
    background-image: url('../assets/Contact/end.png');
    color: white;
    object-fit: cover;
    height:30rem;
    border-radius: 5rem;
    background-repeat: no-repeat;


}

.buttony {
    background-color: #625498;
    border-radius: 2rem;
} */
</style>
