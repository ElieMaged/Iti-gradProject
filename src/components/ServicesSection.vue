<template>
  <section class="services-section py-28">
    <div class="custom-container">
      <div class="">
        <h2 class="services-title">{{ $t("servicesSectionTitle") }}</h2>
        <hr class="services-divider" />
        <div class="services-grid">
          <div
            v-for="(service, idx) in services"
            :key="idx"
            class="service-card"
          >
            <img
              :src="service.image"
              :alt="service.title"
              class="service-image"
            />
            <div class="service-content">
              <h3 class="service-title">{{ $t(service.title) }}</h3>
              <p class="service-desc">{{ $t(service.desc) }}</p>
              <button
                class="service-btn"
                @click="$router.push(service.route || '#')"
              >
                {{ $t("bookNow") }}
                <span class="arrow"
                  ><svg
                    width="13"
                    height="12"
                    viewBox="0 0 13 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.3717 8.07225C10.3783 8.58189 10.7968 9.0004 11.3065 9.00702C11.8161 9.01364 12.2239 8.60586 12.2173 8.09622L12.1269 1.13614C12.1203 0.626497 11.7017 0.207986 11.1921 0.201368L4.23203 0.110977C3.72238 0.104357 3.3146 0.512138 3.32122 1.02178C3.32784 1.53142 3.74635 1.94993 4.25599 1.95655L8.98828 2.01801L0.667927 10.3384C0.312237 10.694 0.319825 11.2783 0.684875 11.6434C1.04993 12.0084 1.6342 12.016 1.98989 11.6603L10.3102 3.33997L10.3717 8.07225Z"
                      fill="black"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import "../style.css";
export default {
  name: "ServicesSection",
  data() {
    return {
      services: [
        {
          title: "plumbingServiceTitle",
          title: "Plumbing",
          route: "/plumbing",

          image: "/images/servicesImages/plumbing.png",
          desc: "plumbingServiceDesc",
        },
        {
          title: "carpentryServiceTitle",

          title: "Carpentry",
          route: "/carpentry",

          image: "/images/servicesImages/Carpentry.png",
          desc: "carpentryServiceDesc",
        },
        {
          title: "electricityServiceTitle",

          title: "Electricity",
          route: "/electricity",

          image: "/images/servicesImages/Electrecity.png",
          desc: "electricityServiceDesc",
        },
        {
          title: "acTechniciansServiceTitle",

          title: "AC Technicians",
          route: "/aircondition",

          image: "/images/servicesImages/Ac Technicions.png",
          desc: "acTechniciansServiceDesc",
        },
        {
          title: "applianceRepairServiceTitle",

          title: "Electrical Appliance Repair",
          route: "/elecTechnicians",

          image: "/images/servicesImages/electrical appliance repair.png",
          desc: "applianceRepairServiceDesc",
        },
        {
          title: "wallFinishingServiceTitle",

          title: "Wall finishing",
          route: "/wallfinishing",

          image: "/images/servicesImages/wall finishing.png",
          desc: "wallFinishingServiceDesc",
        },
      ],
    };
  },
};
</script>

<style scoped>
.services-section {
  background-color: var(--primary-text);
}
.dark .services-section {
  background: var(--primary-bg);
  color: var(--primary-text);
}
@media (max-width: 1000px) {
  .services-section {
    margin: 80px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
.services-title {
  font-size: 44px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 40px;
  font-family: Outfit, sans-serif;
  line-height: 56px;
}
.services-divider {
  width: 100%;
  background-color: var(--light-green);
  margin-bottom: 32px;
}
.services-grid {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  width: 100%;
}
.service-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.2s;
  border-radius: 30px;
}
.dark .service-card {
  background: var(--secondary-bg);
}

.service-card:hover {
  transform: translateY(-4px);
}
.dark .service-card:hover {
  transform: translateY(-4px);
}
.service-image {
  width: 100%;
  height: 262px;
  object-fit: cover;
  border-radius: 30px;
}
.service-content {
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.service-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 32px;
  font-family: Outfit, sans-serif;
  color: var(--black-text);
}
.dark .service-title {
  color: var(--color-white);
}
.service-desc {
  font-size: 16px;
  color: var(--text-gray);
  margin-bottom: 18px;
  flex: 1;
  font-weight: 400;
  line-height: 24px;
}
.dark .service-desc {
  color: var(--card-text-gray);
}
.service-btn {
  background: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
  display: flex;
  gap: 10px;
  width: fit-content;
  align-items: center;
  transition: background 0.2s;
  margin-bottom: 30px;
}
.dark .service-btn {
  background: var(--primary-color);
  color: var(--white);
}
.service-btn:hover {
  background: #4e3b7a;
}
.dark .service-btn:hover {
  background: #4e3b7a;
  color: var(--primary-text);
}
.arrow svg {
  font-size: 20px;
  font-weight: 800;
}
.arrow svg path {
  fill: var(--white);
}
.dark .arrow svg path {
  fill: var(--white);
}
/* Responsive design */
@media (max-width: 1024px) {
  .services-section {
    margin: 60px 0;
  }
  .services-title {
    font-size: 2.2rem;
    margin-bottom: 35px;
  }

  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 700px) {
  .services-section {
    margin: 40px 0;
  }
  .services-title {
    font-size: 2rem;
    margin-bottom: 30px;
  }

  .services-grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }

  .service-card {
    max-width: 400px;
  }

  .service-content {
    padding: 20px 16px 16px 16px;
  }

  .service-title {
    font-size: 1.1rem;
  }

  .service-desc {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .services-section {
    margin: 20px 0;
  }
  .services-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .services-grid {
    gap: 16px;
  }

  .service-image {
    height: 150px;
  }

  .service-content {
    padding: 16px 12px 12px 12px;
  }

  .service-title {
    font-size: 1rem;
  }

  .service-desc {
    font-size: 0.85rem;
  }

  .service-btn {
    padding: 8px 10px;
    font-size: 0.9rem;
  }
}
</style>
