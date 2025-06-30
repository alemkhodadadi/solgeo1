<script setup lang="ts">
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import AppLang from '@/layouts/AppLangButton.vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { z } from 'zod';

import { zodResolver } from '@primevue/forms/resolvers/zod';

const toast = useToast();
const loading = ref(false);

const initialValues = ref({
    username: '',
	password: ''
});

const errorMessage = ref('');

const resolver =  zodResolver(
    z.object({
        username: z.string().min(1, { message: 'Username is required.' }),
        password: z.string().min(1, { message: 'Password is required.' })
    })
);

const auth = useAuthStore();
const router = useRouter();

async function onFormSubmit(e) {
	console.log('Form submitted with values:', e);
	if(e.valid){
		loading.value = true;
		try {
			await auth.login({
				username: initialValues.value.username,
				password: initialValues.value.password,
			});
				console.log('Login successful:', auth.user);
			// Redirect on success
			router.push('/structures'); // change to your actual home page
		} catch (error: any) {
			errorMessage.value = error?.response?.data?.message || 'Login failed';
		} finally {
			loading.value = false;
		}
	}
}



</script>


<template>
    <FloatingConfigurator />
	
    <div style="background-image: url('images/backgroundimage.png');" class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 22px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 20px">
                    <div class="text-center mb-8 ">
                        <svg viewBox="0 0 1464 304" xmlns="http://www.w3.org/2000/svg" fill="none" class="self-center justify-self-center" width="50%">
                            <g transform="translate(0,304) scale(0.1,-0.1)" fill="currentColor" stroke="none">
                            <path d="M3128 2878 c-111 -201 -227 -385 -354 -564 l-104 -146 0 -1079 0 -1079 275 0 275 0 0 1510 c0 831 -2 1510 -4 1510 -2 0 -42 -69 -88 -152z"/>
                            <path d="M5382 2209 c-332 -32 -552 -187 -617 -436 -21 -77 -20 -240 0 -318 33 -127 129 -231 280 -306 107 -53 213 -83 500 -144 438 -93 552 -170 563 -377 6 -120 -14 -182 -84 -258 -57 -61 -137 -109 -224 -134 -129 -37 -385 -39 -526 -5 -74 18 -165 63 -217 109 -49 43 -107 145 -107 189 0 69 -3 71 -106 71 l-94 0 0 -48 c0 -26 7 -74 15 -107 52 -198 210 -339 453 -402 130 -33 368 -42 519 -19 364 55 572 266 573 577 0 197 -67 327 -223 429 -109 71 -203 101 -620 195 -185 42 -259 65 -344 107 -77 38 -147 110 -164 169 -18 64 -16 185 5 247 38 114 171 213 336 248 103 23 349 23 450 1 204 -46 341 -168 357 -322 l6 -55 98 0 99 0 0 38 c0 22 -9 74 -20 118 -63 246 -290 401 -631 433 -126 12 -155 12 -277 0z"/>
                            <path d="M8460 1125 l0 -1095 95 0 95 0 0 1095 0 1095 -95 0 -95 0 0 -1095z"/>
                            <path d="M9949 2209 c-303 -28 -560 -155 -719 -355 -152 -191 -230 -444 -230 -745 0 -347 102 -621 302 -815 198 -192 458 -284 803 -284 291 0 536 71 716 209 120 90 109 37 109 548 0 352 -3 444 -12 440 -7 -2 -52 -16 -100 -31 l-88 -27 0 -374 0 -375 -42 -31 c-117 -86 -286 -143 -473 -159 -374 -32 -691 81 -850 305 -124 173 -172 369 -162 654 6 183 32 302 93 425 123 247 343 383 677 417 255 25 504 -24 684 -135 l42 -26 60 79 60 79 -38 25 c-62 41 -176 96 -254 121 -152 50 -394 73 -578 55z"/>
                            <path d="M2180 1611 c-80 -81 -202 -199 -272 -261 l-128 -114 0 -613 0 -613 275 0 275 0 0 875 c0 481 -1 875 -2 875 -2 -1 -68 -67 -148 -149z"/>
                            <path d="M7142 1590 c-94 -12 -241 -62 -315 -107 -225 -136 -337 -387 -324 -723 8 -215 60 -371 165 -497 127 -152 312 -234 562 -249 274 -17 489 54 647 212 126 126 184 262 203 478 9 103 1 249 -20 339 -60 269 -251 462 -520 527 -99 24 -290 33 -398 20z m304 -205 c117 -21 218 -70 287 -138 106 -107 149 -235 149 -442 0 -261 -82 -429 -257 -522 -102 -54 -171 -67 -340 -67 -134 0 -158 3 -227 26 -189 63 -302 191 -344 389 -20 95 -14 317 11 399 38 122 108 217 204 279 125 81 323 109 517 76z"/>
                            <path d="M11915 1589 c-315 -40 -535 -227 -617 -525 -18 -67 -21 -106 -21 -259 -1 -155 2 -191 21 -260 75 -272 246 -439 517 -507 126 -31 371 -31 490 1 101 26 229 89 284 138 l42 38 -69 68 -69 68 -58 -40 c-33 -23 -95 -53 -139 -68 -72 -23 -97 -26 -226 -27 -92 -1 -165 4 -200 13 -203 50 -342 195 -383 396 l-14 70 663 5 662 5 25 23 c14 13 28 38 31 56 11 56 -13 234 -45 331 -111 350 -451 529 -894 474z m350 -212 c131 -36 231 -103 294 -197 42 -64 91 -198 91 -251 l0 -29 -585 0 -585 0 0 33 c0 17 7 56 15 86 55 208 208 335 450 375 53 8 269 -3 320 -17z"/>
                            <path d="M13695 1589 c-319 -43 -535 -227 -617 -525 -18 -67 -21 -106 -21 -259 -1 -155 2 -191 21 -260 91 -330 325 -508 698 -531 116 -8 266 8 364 38 180 55 333 182 408 338 50 104 69 179 82 311 35 365 -101 667 -361 804 -140 73 -387 110 -574 84z m360 -215 c139 -37 257 -130 314 -246 50 -102 65 -177 65 -323 0 -146 -15 -221 -65 -323 -91 -187 -295 -283 -574 -269 -358 17 -545 221 -545 593 0 327 148 524 435 580 88 17 286 11 370 -12z"/>
                            <path d="M1425 961 c-8 -13 -410 -281 -473 -316 l-52 -28 0 -304 0 -303 270 0 270 0 0 480 c0 264 -2 480 -4 480 -3 0 -7 -4 -11 -9z"/>
                            <path d="M430 364 c-105 -51 -283 -128 -385 -167 l-40 -15 -3 -86 -3 -86 276 0 275 0 0 205 c0 113 -1 205 -2 205 -2 0 -55 -26 -118 -56z"/>
                            </g>
                        </svg>
                        <div class="text-surface-900 dark:text-surface-0 mt-5 text-1xl font-medium mb-4">{{$t('welcome')}}</div>
                        <span class="text-muted-color font-medium">{{$t('login.credentialSentence')}}</span>
                    </div>

                    <Form v-slot="$form" :resolver="resolver" @submit="onFormSubmit" class="w-full flex flex-col gap-4">
						<div class="flex flex-col gap-1">
							<InputText v-model="initialValues.username" name="username" type="text" placeholder="Username" fluid />
							<Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{ $form.username.error.message }}</Message>
						</div>
						<div class="flex flex-col gap-1">
							<Password v-model="initialValues.password" name="password" placeholder="Password" :feedback="false" toggleMask fluid />
							<Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
								<ul class="my-0 px-4 flex flex-col gap-1">
									<li v-for="(error, index) of $form.password.errors" :key="index">{{ error.message }}</li>
								</ul>
							</Message>
						</div>
						<Button type="submit" severity="secondary" :label="$t('form.submit')" />
                    </Form>
                </div>
            </div>
        </div>
        <Toast/>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
