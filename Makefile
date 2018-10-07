EXECUTABLES = closure-compiler cat echo
K := $(foreach exec,$(EXECUTABLES),\
        $(if $(shell which $(exec)),some string,$(error Dependency $(exec) not in PATH)))

CLOSURE = closure-compiler
CLOSUREFLAGS = --compilation_level ADVANCED_OPTIMIZATIONS
CLOSURECMD = $(CLOSURE) $(CLOSUREFLAGS)

yt-jailbreak: wrapper-cmp
	@mkdir -p build out
	printf 'javascript:' > out/yt-jailbreak-url
	bash urlencode.sh '$(shell cat build/wrapper-cmp.js)' >> out/yt-jailbreak-url
	@echo "Done"
	
wrapper-cmp: ytj-cmp
	@mkdir -p build out
	printf '$(shell $(CLOSURECMD) src/wrapper.js)' "$(shell base64 build/ytj-cmp.js | tr -d '\n')" > build/wrapper-cmp.js
	
ytj-cmp: src/yt-jailbreak.js src/wrapper.js
	@mkdir -p build out
	$(CLOSURECMD) --js_output_file=build/ytj-cmp.js src/yt-jailbreak.js

clean:
	rm -r build out