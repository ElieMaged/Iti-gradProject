<script setup lang="ts">
import { ref } from 'vue'

</script>

<template>
    <footer class="footer text-white m-1">

<div class="footer__second p-5">

<div class="footer__two">
  
    <!-- list1 -->
<ul>
<li><img class="w-20" src="../assets/Logo.png"></li>
<li class=" text-center w-60">
    BoltFix exists to simplify home maintenance for every household in Egypt by connecting users with skilled, verified technicians.
</li>
<li>
    Social Links
</li>
<li>
    Navigation
</li>

</ul>

<!-- list2 -->

<ul class="text-center">
<li class="">
    <h2>Quick Link</h2>
</li>
<li>
    Home
</li>
<li>
    About Us
</li>
<li>
    Services
</li>
<li>
    Contact Us
</li>
<li>
    FAQS
</li>

</ul>

<!-- list3 -->

<ul class="">
<li><h2 class="">Service</h2></li>
<li>
    Pumping
</li>
<li>
    Air conditioner technicians
</li>
<li>
    Electricity
</li>
<li>
    Wall finishing
</li>
<li>
    Carpentry
</li>

</ul>

</div>
<div class="footer__second--address">
    <ul class="">
        <li>
            <h2>Contact Us</h2>

        </li>
        <li>
            <span class="flex flex-row"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone-fill mr-2" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
        </svg>925-465-3762</span>

        </li>
        <li>
    
        <span class="flex flex-row"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-at-fill mr-2" viewBox="0 0 16 16">
      <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2zm-2 9.8V4.698l5.803 3.546zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 9.671V4.697l-5.803 3.546.338.208A4.5 4.5 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671"/>
      <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791"/>
    </svg>boltfix@gmail.com</span>

</li>
<li>

    <span class="flex flex-row"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill mr-2" viewBox="0 0 16 16">
    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
    </svg>4096 Modesto,
    CA 95350, USA</span>
</li>
    </ul>
    

</div>

</div>

<div class="footerTwo">
    <hr>
© 2025 Design and Developed by ITI students
</div>

</footer>
</template>

<style lang="scss" scoped >
.footer {
    display: flex;
    flex-direction: column;
    margin: 0px;
    &__one {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
       background-color: rgb(255, 255, 255);
       margin: 0;
       &__row {
        display: flex;
        flex-direction: row;
        justify-content:space-around;
        margin: 1rem;
        &__news {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
        }
       }
       
    }
&__two {
        display: flex;
        flex-direction: row;
    }
    &__two > ul {
        list-style: none
    }
}


@media (max-width: 700px) {
  .footer {
    &__one__row {
    display: flex;
    flex-direction: column;
    }
    &__second {
      display: flex;
    flex-direction: column;
   justify-content: space-around;
      
    }
    &__two {
    display: flex;
    flex-direction: column;
   justify-content: space-around;
    }
ul > li {
     text-align:center;
}
  }

}
.footer {
  &__one--input {
    &__:focus {
        border:none;
        border-color: transparent;
    }
  border: none;
  border-color: transparent;
  border-bottom:1px solid #444;
  padding-left: 1rem;
  padding-left: 1rem;
  width:100%;
  }
&__one--button {
  border: none !important;
  border-color: transparent !important;
  background-color: black;
  color: white;
  padding-top: .5rem;
  padding-bottom: .5rem;
  width:50%;
  cursor: pointer;
  box-shadow: 5px 10px;
}
&__one__row--email {
display: flex;
flex-direction: column;
margin: 1rem;
}
&__second {
    text-align: right;
    display:flex;
    flex-direction: col;
    justify-content: space-around;
     background-color: #625397;
 text-align: center;
 &--address {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align:end;
    margin-right: 1rem;
    margin-bottom: 1rem;
 }
}
}

ul > li {
    text-align:left;
    margin-top: 1rem;
}









</style>