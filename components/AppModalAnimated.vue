<template>
	<Transition name="modal">
		<div
			v-if="isActive"
			class="fixed inset-0 z-50 flex justify-center w-screen h-screen bg-white sm:items-center z-80 sm:bg-black/90"
			id="modal"
		>
			<div
				role="alert"
				class="container relative h-full mx-auto sm:max-w-2xl sm:w-11/12 sm:h-auto"
			>
				<slot />
				<!-- close button -->
				<div
					class="absolute transition duration-150 ease-in-out cursor-pointer top-2 right-2 text-stone-500 hover:text-amber-500"
					@click="emit('close')"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						aria-label="Close"
						class="icon icon-tabler icon-tabler-x"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						stroke-width="2.5"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" />
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup>
	const props = defineProps({
		item: {
			type: Object,
			default: null,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
	});

	const emit = defineEmits(["close"]);
  const modal = ref(null);


</script>

<style>
	.modal-bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal {
		position: relative;
		background-color: white;
		padding: 50px 100px;
		border-radius: 5px;
	}

	.modal-enter-active,
	.modal-leave-active {
		transition: all 0.25s ease-in-out;
	}
	.modal-enter-from,
	.modal-leave-to {
		opacity: 0;
		transform: scale(1.1);
	}
</style>
