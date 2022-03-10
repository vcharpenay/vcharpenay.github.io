set xrange [-1:18]

unset key

set style fill transparent solid 0.2

set xtic rotate by -45

set ylabel "nb. Pokémon"
set xlabel "Pokémon type"

plot "pokemon-type-stat.tsv" u 2:xtic(1) w hist