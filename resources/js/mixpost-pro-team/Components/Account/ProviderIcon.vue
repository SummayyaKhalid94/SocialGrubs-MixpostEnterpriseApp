<script setup>
import {computed} from "vue";
import useProviderClassesColor from "@p/Composables/useProviderClassesColor";
import TwitterIcon from "@p/Icons/Twitter.vue";
import FacebookIcon from "@p/Icons/Facebook.vue";
import InstagramIcon from "@p/Icons/Instagram.vue";
import MastodonIcon from "@p/Icons/Mastodon.vue";
import YoutubeIcon from "@p/Icons/Youtube.vue";
import GBPIcon from "@p/Icons/GBP.vue";
import PinterestIcon from "@p/Icons/Pinterest.vue";
import LinkedinIcon from "@p/Icons/Linkedin.vue";
import TikTokIcon from "@p/Icons/TikTok.vue";
import Threads from "@p/Icons/Threads.vue";
import Bluesky from "@p/Icons/Bluesky.vue";

const props = defineProps({
    provider: {
        type: String,
        required: true
    }
})

const providers = {
    'twitter': TwitterIcon,
    'facebook': FacebookIcon,
    'facebook_page': FacebookIcon,
    'facebook_group': FacebookIcon,
    'instagram': InstagramIcon,
    'threads': Threads,
    'mastodon': MastodonIcon,
    'youtube': YoutubeIcon,
    'gbp': GBPIcon,
    'pinterest': PinterestIcon,
    'linkedin': LinkedinIcon,
    'linkedin_page': LinkedinIcon,
    'tiktok': TikTokIcon,
    'bluesky': Bluesky,
};

const component = computed(() => {
    return providers[props.provider];
});

const {textClasses} = useProviderClassesColor(props.provider);
</script>
<template>
    <component :is="component" :class="textClasses"/>
</template>
