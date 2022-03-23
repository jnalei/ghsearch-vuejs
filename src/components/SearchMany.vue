<template>
  <div id="main">
    <input
      type="text"
      name="gh-username"
      placeholder="Search - User Input"
      v-model="userInput"
      @keydown.enter="search"
      :class="{ 'has-error': error }"
    />

    <span class="loading" v-if="loading"
      >Searching GitHub for "{{ userInput }}"...</span
    >

    <div class="box" v-if="(results && !loading) || (error && !loading)">
      <div v-if="results">
        <div v-for="result in results" :key="result" :result="result">
          <a v-bind:href="`${result.html_url}`" target="_blank">
            {{ result.html_url }}
            <img
              v-if="result.avatar_url"
              :src="result.avatar_url"
              class="userImg"
              :alt="'GitHub Avatar for ' + userInput"
            />
            <h4 v-if="result.login">{{ result.login }}</h4>
          </a>
        </div>

        <span v-if="error"
          >Sorry, can't find a user called "<i>{{ userInput }}</i
          >"!</span
        >
        <Pagination
          :totalPages="totalPages"
          :perPage="30"
          :currentPage="currentPage"
          @pagechanged="onPageChange"
        />

        Total Results: {{ allItems }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Pagination from "../components/Pagination.vue";

export default {
  props: {
    result: Object,
  },
  components: {
    Pagination,
  },
  data() {
    return {
      userInput: "",
      results: [Object],
      error: "",
      loading: false,
      currentPage: 1,
      totalPages: 0,
      allItems: 0,
    };
  },
  watch: {
    userinput: function () {
      this.error = "";
    },
  },
  methods: {
    search: function () {
      if (this.userInput) {
        this.loading = true;

        axios
          .get("https://api.github.com/search/users?q=" + this.userInput)
          .then((response) => {
            this.allItems = response.data.total_count;
            let totalCount = Math.floor(response.data.total_count / 30);
            if (totalCount <= 999) {
              this.totalPages = totalCount;
            } else {
              this.totalPages = 34;
            }

            this.results = response.data.items;
            this.error = "";

            this.loading = false;
          })
          .catch((error) => {
            this.results = "";
            this.error = error;

            this.loading = false;
          });
      } else {
        this.results = "";
        this.error = "";

        this.loading = false;
      }
    },
    paginate() {
      axios
        .get(
          "https://api.github.com/search/users?q=" +
            this.userInput +
            `&page=${this.currentPage}`
        )
        .then((response) => {
          let totalCount = Math.floor(response.data.total_count / 30);
          if (totalCount <= 999) {
            this.totalPages = totalCount;
          } else {
            this.totalPages = 34;
          }

          this.results = response.data.items;
        })
        .catch((error) => {
          console.log(error);
          this.results = "";
          this.error = error;

          this.loading = false;
        });
    },
    onPageChange(page) {
      this.currentPage = page;
      this.paginate();
    },
  },
};
</script>

<style scoped>
div {
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue",
    Helvetica, Arial, "Lucida Grande", sans-serif;
  font-weight: 300;
  font-size: 16px;
  line-height: 1.4;
  display: inline;
}
input {
  display: block;
  width: 350px;
  max-width: 74%;
  padding: 15px 25px;
  margin: 45px auto;
}
.userImg {
  opacity: 0.8;
  border-radius: 50%;
}
.userImg :hover {
  opacity: 1;
}
.has-error {
  border: 1px solid #96281b;
  outline: none;
}
.box {
  display: block;
  width: 650px;
  max-width: 74%;
  padding: 25px;
  margin: 15px auto;
  background: #eeeeee;
  border: 1px solid #d2d7d3;
  text-align: center;
}
.box img {
  display: block;
  width: 100px;
  height: auto;
  margin: 0 auto 15px;
}
.loading {
  display: block;
  text-align: center;
  color: #6c7a89;
}
</style>
