build:
	cd rust && cargo build --target wasm32-unknown-unknown --release
	wasm-tools component new ./rust/target/wasm32-unknown-unknown/release/core_rust.wasm \
			-o ./rust/core.wasm
	rm -rf src/generated/*.js
	rm -rf src/generated/*.wasm
	jsct transpile ./rust/core.wasm -o src/generated -O -I
	node scripts/patch.js
	pnpm build:ts
	mkdir -p wasm
	cp -r ./src/generated/*.wasm ./wasm/
