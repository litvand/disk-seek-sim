# disk-seek-sim

When a hard disk driver recieves a request to read some disk sector from the operating system, it doesn't immediately move the read head to that sector, but stores the sector's index in a read buffer. This simulator shows the effect on total seek distance (i.e. read head movement) of using various algorithms to decide in which order to actually read the sectors in the read buffer.

To start the simulation, open "www/main.html". The orange line indicates the sector where the read head is initially. Blue arrows/dot indicate head movement and reading; black arrows indicate that the head moved, but (intentionally) didn't read the sector to which it moved.
