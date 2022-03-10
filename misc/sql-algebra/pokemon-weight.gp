set xrange [0:500]

unset key

set ylabel "nb. Pokémon"
set xlabel "weight (kg)"

plot "pokemon.tsv" u ($4)/10 w hist bins 20 notitle