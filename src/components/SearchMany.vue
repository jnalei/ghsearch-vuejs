<template>
  <div id="main">
    <h2 class="searchHeader">Search GitHub Users:</h2>
    <input
      type="text"
      name="gh-username"
      placeholder="Search..."
      v-model="userInput"
      @keydown.enter="search"
      :class="{ 'has-error': error }"
    />

    <span class="loading" v-if="loading"
      >Searching GitHub for "{{ userInput }}"...</span
    >
    Total Results: {{ allItems }}
    <div class="box" v-if="(results && !loading) || (error && !loading)">
      <div v-if="results">
        <div
          class="resultsBox"
          v-for="result in results"
          :key="result"
          :result="result"
        >
          <a v-bind:href="`${result.html_url}`" target="_blank">
            <img
              v-if="result.avatar_url"
              :src="result.avatar_url"
              class="userImg"
              :alt="'GitHub Avatar for ' + userInput"
            />
            {{ result.html_url }}
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
}
input {
  display: block;
  width: 350px;
  max-width: 74%;
  padding: 15px 25px;
  margin: 25px auto;
  opacity: 0.8;
  background: #e7e2d3;
  border-radius: 6px;
  outline: transparent;
}

a {
  text-decoration: none;
  color: #625d8e;
}
a :hover {
  text-decoration: underline;
}
.userImg {
  border-radius: 50%;
}

.has-error {
  border: 1px solid #96281b;
  outline: none;
}
.resultsBox {
  opacity: 0.8;
}

.box {
  background: #f1ede2;
  width: 1000px;
  padding: 45px 0px 45px 0px;
  margin: 15px auto;
}
.box img {
  display: flex;
  width: 100px;
  height: auto;
  margin: 0 auto 15px;
  opacity: 0.7;
}
.box img:hover {
  opacity: 1;
}
.loading {
  display: block;
  text-align: center;
  color: #6c7a89;
}
</style>
