import type { FC } from "react";

export const NotesPage: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 font-mono">
      <div className="max-w-3xl w-full space-y-8">
        <h1 className="text-4xl font-semibold tracking-wider text-white mb-8 text-center">
          Notes from the Authors
        </h1>

        <div className="space-y-8">
          <div>
            <p className="text-gray-400 text-xs tracking-widest uppercase mb-2">
              Elias Duke
            </p>
            <p className="text-white leading-relaxed text-sm tracking-wider">
              Fall 2025 at RIT felt largely the same as previous semesters. We
              still had classes, hot days morphing into cold ones with brutal
              winds, rain turning to snow, and the days growing shorter and
              shorter until people getting out of class at 4:30 were met with
              dusk. Still, the campus kept its fun spirit, and I enjoyed this
              semester as I had all the rest. The efforts and culture of
              students keep this place engaging. It was nice to see the hordes
              of zombies campaigning against the humans. The DJO concert was
              some of the most fun I've ever had on this campus. The atmosphere
              was electric! I'm gonna miss this place.
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-xs tracking-widest uppercase mb-2">
              Emany C.
            </p>
            <p className="text-white leading-relaxed text-sm tracking-wider">
              Fall 2025 at RIT has moved extremely fast, to the point where I
              only recently realized how close the semester is to ending. With
              the constant flow of assignments, deadlines, and responsibilities,
              it has been difficult to slow down and fully enjoy the semester
              while it is still happening. Most of my time has been spent
              focusing on completing work and staying on track academically
              rather than taking in the experience as a whole. Because of this,
              I personally did not enjoy this semester very much. It has felt
              more like a period of endurance than exploration, with the pace
              leaving little room to step back and appreciate campus life.
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-xs tracking-widest uppercase mb-2">
              Taryn Jones
            </p>
            <p className="text-white leading-relaxed text-sm tracking-wider">
              This semester has been filled with fun and new experiences.
              Adjusting to a new environment while being far from home was a big
              change, but campus quickly began to feel like a second home
              because of the new friendships that I made. Campus life played a
              big role in my semester, I enjoyed finding things to do with
              friends and going to sports games. If I had to choose one word to
              describe Fall 2025 at RIT I would choose OPEN-MINDED. Overall, my
              first semester at RIT was great and I can't wait to see how RIT
              changes over the next few years.
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-xs tracking-widest uppercase mb-2">
              Vishnu Shiyamsaran
            </p>
            <p className="text-white leading-relaxed text-sm tracking-wider">
              RIT seemed to be very chill this semester. Personally, I was
              pretty relaxed the entire time. The majority of my friends were
              also chilling this semester too. There definitely has been a sense
              of fatigue with RIT though. I've noticed that a lot of people are
              kind of tired of RIT. That could be because of some of the changes
              that the school has made within the past semester. But overall,
              nothing too crazy stood out to me this semester. Everyone was just
              moving along trying to get their work done, and the semester
              seemed to go by relatively quickly, at least for me.
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-xs tracking-widest uppercase mb-2">
              Charlie Luebstorff
            </p>
            <p className="text-white leading-relaxed text-sm tracking-wider">
              Had a good time! Very happy to be graduating!!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
