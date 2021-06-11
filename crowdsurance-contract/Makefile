.PHONY: all clean

CONTRACTS=$(wildcard src/crwds*.arl)
# CONTRACTS=src/lang_test_fcmp.arl src/lang_test_part.arl 
O_LIGO=$(patsubst %.arl,out/%.ligo,$(notdir $(CONTRACTS)))
O_SCAML=$(patsubst %.arl,sim/%.ml,$(notdir $(CONTRACTS)))
O_MD=$(patsubst %.arl,out/%.md,$(notdir $(CONTRACTS)))
O_WHY=$(patsubst %.arl,out/%.mlw,$(notdir $(CONTRACTS)))
O_PY=$(patsubst %.arl,out/%.py,$(notdir $(CONTRACTS)))
OUTPUTS=$(O_LIGO) $(O_SCAML) $(O_MD) $(O_WHY) $(O_PY)

all: $(OUTPUTS) prove sim

out/%.ligo	: src/%.arl
	archetype 	-t ligo 	$< > $@

sim/%.ml	: src/%.arl
	archetype 	-t scaml 	$< > $@

out/%.md	: src/%.arl
	archetype 	-t markdown	$< > $@

out/%.mlw	: src/%.arl
	archetype 	-t whyml 	$< > $@

out/%.py	: src/%.arl
	archetype 	-t smartpy 	$< > $@

prove:
	-bash ./prove.sh 

clean:
	rm -r out/* sim/crwds_* sim/SCaml*

sim: copy-scaml
	cd sim && dune build

# why3-ide:
# 	why3 ide -L ~/.opam/default/share/archetype/mlw/ out/crowdsurance.why

# coq:
# 	coq-of-ocaml test/crowdsurance.ml

copy-scaml:
	cp -r ~/Repositories/scaml/lib/*ml* sim/

push-both:
	git push origin && git push origin-gh
