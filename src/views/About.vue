<template>
    <!-- //About-1// -->
  <div class="">
      <div class="contact-1 m-5">
        <div class="blur"></div>
        <h1 class="text-center flex flex-row justify-center h1
  ">About Us</h1>
    </div>
  </div>
  <div class="flex flex-col md:flex-row m-5 col-span-6">
      <div class="m-5">
        <h1>Who Are We?</h1>
At BoltFix, we're redefining how home maintenance is done. As Egypt’s trusted platform for reliable repair and installation services, we connect you with skilled, verified technicians across plumbing, electrical, carpentry, appliance repair, and more — all with a click. Our mission is simple: to bring professionalism, transparency, and peace of mind to every home. Whether it’s a quick fix or a big job, we make sure it’s done right, on time, and with care.
<br>
<br>
<br>
<br>
<h1>Our Mission</h1>
Our mission at BoltFix is to simplify access to trusted home repair services by empowering skilled technicians and delivering a seamless, dependable experience for every customer. We aim to raise the standard of home maintenance in Egypt through speed, honesty, and quality — ensuring that every task, big or small, is completed with precision, professionalism, and care.
    </div>
      <div class="flex flex-col md:mr-3 col-span-3">
          <img class=" md:m-2 sm:m-2" src="../assets/contact/collage-1.jpg" alt="">
        <img class=" md:m-2 sm:m-2" src="../assets/contact/collage-2.jpg" alt="">
    </div>
          <div class="flex flex-col md:mr-3 col-span-3">
          <img class=" md:m-2 sm:m-2" src="../assets/contact/collage-3.png" alt="">
        <img class=" md:m-2 sm:m-2" src="../assets/contact/collage-1.jpg" alt="">
    </div>
  </div>
  <!-- About-2 -->
   <div class="container flex flex-row gap-10 md:gap-15 text-center about-2">
    <h2 class="accolades md:pr-5">150+ Team Member</h2>
    <h2 class="accolades md:pr-5">100+ Winning Award</h2>
    <h2 class="accolades md:pr-5">700+ Complete Projects</h2>
    <h2 class="accolade">684+ Client Reviews</h2>
   </div>
</template>


<style scoped>
img {
  width: 60rem;
  height: 20rem;
  border-radius: 1rem;
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
    border-right: solid rgb(0, 0, 0) .1rem;

}

.about-2 {
    background-color: #ffc230;
    border-radius: 1rem;
}
.vl {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background-color: black;
  transform: translateX(-50%);
}
</style>
