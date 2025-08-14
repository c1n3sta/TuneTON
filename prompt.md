Now it is necessary to implement the following functionality:

All genres need to be divided into main genres and subgenres. When the user selects a main genre, the subgenres should appear as bubbles around the main genre. These bubbles can drift slightly on the screen but should not move too far away from their main genre. The user can drag to move around the screen in all directions — up, down, left, and right. The "Next" button and the header remain fixed in place during this.

1 - Main genres should not be placed rigidly in a circle, but drift smoothly.
2 - Genres and subgenres should not overlap each other, including overlaps of subgenres with a subgenre even from different genres. For this, dynamic distribution algorithms can be used taking into account collisions and repulsion of objects.
3 - It is necessary to make the external interface available for selecting genres, as well as subgenres. The possibility of multiple selection and a clear visual indication of selected elements is supported.
4 - Subgenres should not be automatically closed after opening. The user should see that all subgenres are open.
5 - Adjust the correctness of movement around the "world" of genres and subgenres so that the user can freely move and take them into account, it currently works with bugs.
6 - We recommend increasing the freedom of drift so that genres do not get stuck in fixed positions. You can increase the value of random offsets and add smooth transitions.
7 - When opening a genre, subgenres should not blink much and overlap each other. Observe adaptation to animation and positioning so that they move neatly without any intersections.
8 - when a genre appears, subgenres begin to increase greatly, reducing their space, and sometimes they remain superimposed on each other by genre and other subgenres for a long time. THIS SHOULD NOT HAPPEN. It is necessary to make it so that when considering objects, the surrounding objects smoothly move apart under themselves.
9 - For visual diversity, it is worth adding more genres and subgenres, using bright gradients and more diverse color palettes with smooth transitions and contrasting combinations.
10 - When opening a large number of genres, optimize performance, everything lags.
11 - Subgenres should drift freely, smoothly changing the orbits of the orbits of their genres. To do this, you can use independent physical models of movement, taking into account the interactions between adjacent subgenres and genres.
12 - To prevent subgenres from being placed in a circle at the same distance and overlapping each other, set up algorithms allowing subgenres to change distance and direction relative to the movement mode, taking into account the free space.
13 - For the first display of genres on the screen, adapt animation with the Easy Out effect - a smooth appearance with deceleration, for example, a fade-in with simultaneous scaling from a smaller size to the original.XN