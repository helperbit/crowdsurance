__='
   Helperbit: a p2p donation platform (crowdsurance)
   Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
   
   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.
   
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   
   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <https://www.gnu.org/licenses/>
'

LIB=~/.opam/default/share/archetype/mlw/

process() {
	why3 -L $LIB prove $1 > $1.proof 2>/dev/null
	RETP=$(echo $?)
	why3 -L $LIB prove -P alt-ergo $1 > $1.run.proof 2>/dev/null
	RETAE=$(echo $?)
	# why3 -L $LIB extract -D ocaml64  $1 > /dev/null 2>/dev/null
	# RETML=$(echo $?)

	printf '%-60s' $1
		
	if [ ${RETP} -eq 0 ]; then
		echo -ne "\033[32m OK \033[0m"
	else
		echo -ne "\033[31m KO \033[0m"
	fi
		
	if [ ${RETAE} -eq 0 ]; then
		echo -ne "\033[32m OK \033[0m"
	else
		echo -ne "\033[31m KO \033[0m"
	fi
		
	# if [ ${RETML} -eq 0 ]; then
	# 	echo -ne "\033[32m OK \033[0m"
	# else
	# 	echo -ne "\033[31m KO \033[0m"
	# fi

	echo ""
}

for file in out/*.mlw
do
	process "$file"
done