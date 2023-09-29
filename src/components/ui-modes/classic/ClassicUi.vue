<script>
import BigCrunchButton from "../BigCrunchButton";
import GameHeader from "../GameHeader";
import NewsTicker from "../NewsTicker";


import ClassicSubtabBar from "./ClassicSubtabBar";
import ClassicTabBar from "./ClassicTabBar";
import EternityPointsHeader from "@/components/EternityPointsHeader";
import InfinityPointsHeader from "@/components/InfinityPointsHeader";

export default {
  name: "ClassicUi",
  components: {
    GameHeader,
    ClassicSubtabBar,
    ClassicTabBar,
    NewsTicker,
    InfinityPointsHeader,
    EternityPointsHeader,
    BigCrunchButton
  },
  data() {
    return {
      bigCrunch: false,
      smallCrunch: false,
      newGameKey: "",
      pageIsTop: true,
    };
  },
  computed: {
    tab: () => Tabs.current,
    news() {
      return this.$viewModel.news;
    },
    headerClasses() {
      return `l-old-ui__sticky ${this.pageIsTop ? "" : "background"}`;
    },
  },
  mounted() {
    this.handleScroll();
  },
  methods: {
    update() {
      const crunchButtonVisible = !player.break && Player.canCrunch;
      this.bigCrunch = crunchButtonVisible && Time.bestInfinityRealTime.totalMinutes > 1;
      // This only exists to force a key-swap after pressing the button to start a new game; the news ticker can break
      // if it isn't redrawn
      this.newGameKey = Pelle.isDoomed;
    },
    handleScroll() {
      const ui = document.getElementById("ui");

      ui.addEventListener("scroll", () => {
        if (this.pageIsTop === true && ui.scrollTop > 0) {
          this.pageIsTop = false;
          return;
        }

        if (this.pageIsTop === false && ui.scrollTop <= 0) {
          this.pageIsTop = true;
        }

      });
    },
  },
};
</script>

<template>
  <div id="container" :key="newGameKey" class="container c-old-ui l-old-ui">
    <link rel="stylesheet" type="text/css" href="stylesheets/old-ui.css">
    <BigCrunchButton />
    <template v-if="!bigCrunch">
      <div :class="headerClasses">
        <NewsTicker v-if="news" class="l-old-ui__news-bar" />
        <GameHeader class="l-old-ui__header" />
        <ClassicTabBar />
        <component :is="tab.config.before" v-if="tab.config.before" />
        <ClassicSubtabBar />
      </div>
      <div class="l-old-ui__page">
        <slot />
      </div>
    </template>
  </div>
</template>

<style scoped></style>
