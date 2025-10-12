import { useState } from "react";
import { ChevronLeft, MoreHorizontal, Calendar, Users, Trophy, Star, Clock, Filter, Search, Music, Mic, Headphones, Zap, Gamepad2 } from "lucide-react";
import svgPaths from "../imports/svg-6lqpkqhh8a";
import BottomNavigation from "./BottomNavigation";
import StylishTabs from "./StylishTabs";

// Import contest images
import imgFeaturedContest from "figma:asset/92af5e42f7a6be5cc4a3570d7557d9b846376457.png";
import imgContest1 from "figma:asset/b4d5d93e0e03aef0e9252522600b2fe91d9305c2.png";
import imgContest2 from "figma:asset/2445cdb838670e8ea661ef232b16e90503fdec0b.png";
import imgContest3 from "figma:asset/f6899fe4451eb26d22ac13df75a794b76f152b36.png";

interface Contest {
  id: string;
  title: string;
  description: string;
  prize: string;
  timeLeft: string;
  participants: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  cover: string;
  category: string;
  status: "Active" | "Ending Soon" | "New";
}

interface ContestsPageProps {
  onBack?: () => void;
  onNavigate?: (tab: string) => void;
  onOpenContestDetail?: (contest: any) => void;
  onOpenRankingDetail?: (rankingId: string, category: 'remixers' | 'performers' | 'tracks' | 'genres') => void;
  activeTab?: string;
}

export default function ContestsPage({ onBack, onNavigate, onOpenContestDetail, onOpenRankingDetail, activeTab = "Contests" }: ContestsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [joinedContests, setJoinedContests] = useState(new Set<string>());

  const featuredContest = {
    id: "featured-1",
    title: "Beat Drop Challenge",
    description: "Create the most innovative beat drop using provided samples",
    prize: "$5,000 + Recording Contract",
    timeLeft: "3 days left",
    participants: 1247,
    cover: imgFeaturedContest
  };

  const contests: Contest[] = [
    {
      id: "contest-1",
      title: "Remix Revolution",
      description: "Transform classic tracks into modern masterpieces",
      prize: "$2,000",
      timeLeft: "5 days left",
      participants: 834,
      difficulty: "Intermediate",
      cover: imgContest1,
      category: "Remix",
      status: "Active"
    },
    {
      id: "contest-2", 
      title: "Vocal Vibes",
      description: "Best vocal processing and harmony arrangements",
      prize: "$1,500",
      timeLeft: "2 hours left",
      participants: 456,
      difficulty: "Advanced",
      cover: imgContest2,
      category: "Vocal",
      status: "Ending Soon"
    },
    {
      id: "contest-3",
      title: "Lo-Fi Lounge",
      description: "Create the perfect study session soundtrack",
      prize: "$1,000",
      timeLeft: "1 week left",
      participants: 289,
      difficulty: "Beginner",
      cover: imgContest3,
      category: "Lo-Fi",
      status: "New"
    }
  ];

  const categories = ["All", "Remix", "Vocal", "Lo-Fi", "Electronic", "Hip-Hop"];

  const handleJoinContest = (contestId: string) => {
    const newJoined = new Set(joinedContests);
    if (newJoined.has(contestId)) {
      newJoined.delete(contestId);
    } else {
      newJoined.add(contestId);
    }
    setJoinedContests(newJoined);
  };

  const filteredContests = selectedCategory === "All" 
    ? contests 
    : contests.filter(contest => contest.category === selectedCategory);

  return (
    <div className="bg-[#0d1117] min-h-screen text-white">
      <div className="flex justify-center">
        <div className="w-[400px] bg-[#161b22] rounded-2xl min-h-screen relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <button 
              onClick={onBack}
              className="text-[#c9d1d9] hover:text-[#ff22fb] transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-[18px] font-semibold text-[#c9d1d9] font-['Montserrat']">Contests</h2>
            <button className="text-[#c9d1d9] hover:text-[#ff22fb] transition-colors">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 pb-32">
            {/* Featured Contest Spotlight */}
            <div className="mb-8">
              <h2 className="text-[18px] font-bold text-[#c9d1d9] font-['Inter'] mb-4">Featured Contest</h2>
              <button 
                onClick={() => onOpenContestDetail?.(featuredContest)}
                className="relative bg-[#484f58] rounded-2xl h-[200px] overflow-hidden w-full text-left hover:scale-[1.02] transition-transform"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${featuredContest.cover}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000dd] via-[#00000066] to-[#00000033]" />
                <div className="absolute top-4 right-4">
                  <div className="bg-[#ff4400] px-3 py-1 rounded-full text-[12px] font-bold text-white font-['Inter']">
                    FEATURED
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-[20px] font-bold text-white font-['Inter'] mb-1">{featuredContest.title}</h3>
                  <p className="text-[12px] text-[rgba(255,255,255,0.8)] font-['Inter'] mb-3">{featuredContest.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4 text-[rgba(255,255,255,0.9)]">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      <span className="text-[12px] font-bold font-['Inter']">{featuredContest.prize}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-[12px] font-bold font-['Inter']">{featuredContest.timeLeft}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="text-[12px] font-bold font-['Inter']">{featuredContest.participants}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinContest(featuredContest.id);
                    }}
                    className={`w-full py-3 rounded-[7px] text-[14px] font-bold transition-colors font-['Inter'] ${
                      joinedContests.has(featuredContest.id)
                        ? "bg-[#2ea043] text-white"
                        : "bg-[#ff22fb] hover:bg-[#ff22fb]/90 text-white"
                    }`}
                  >
                    {joinedContests.has(featuredContest.id) ? "Joined!" : "Join Contest"}
                  </button>
                </div>
              </button>
            </div>

            {/* Contest Leaderboards */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat']">Live Leaderboards</h3>
                <button
                  onClick={() => onNavigate?.("Ranking")}
                  className="text-[12px] text-[#ff22fb] font-['Inter'] hover:text-[#ff22fb]/80"
                >
                  View All Rankings
                </button>
              </div>
              
              <div className="bg-[#21262d] rounded-2xl p-4 border border-[#30363d]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[14px] font-semibold text-[#c9d1d9] font-['Montserrat']">Remix Rumble Leaderboard</h4>
                  <span className="text-[10px] bg-[#d29922] text-white px-2 py-1 rounded-full font-['Inter'] uppercase tracking-wide">Live</span>
                </div>
                
                <div className="space-y-2">
                  {[
                    { rank: 1, name: "DarkBeater", score: "1,250 votes", icon: "👑" },
                    { rank: 2, name: "SynthGrover", score: "980 votes", icon: "🥈" },
                    { rank: 3, name: "GrooveBot", score: "850 votes", icon: "🥉" },
                  ].map((entry, index) => (
                    <div key={index} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[14px]">{entry.icon}</span>
                        <div>
                          <span className="text-[12px] font-semibold text-[#c9d1d9] font-['Inter']">{entry.name}</span>
                          <p className="text-[10px] text-[#8b949e] font-['Inter']">{entry.score}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onOpenRankingDetail?.(entry.name.toLowerCase(), 'remixers')}
                        className="text-[10px] bg-[#ff22fb] text-white px-2 py-1 rounded font-['Inter'] hover:bg-[#ff22fb]/90"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => onOpenContestDetail?.({ id: "remix-rumble", title: "Remix Rumble" })}
                  className="w-full mt-3 py-2 bg-[#ff22fb] text-white rounded-lg text-[12px] font-semibold hover:bg-[#ff22fb]/90 transition-colors"
                >
                  View Full Contest
                </button>
              </div>
            </div>

            {/* Enhanced Category Filter */}
            <div className="mb-6">
              <h3 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat'] mb-3">Categories</h3>
              <StylishTabs
                tabs={[
                  { 
                    id: "All", 
                    label: "All", 
                    icon: <Star className="w-4 h-4" />,
                    badge: contests.length.toString()
                  },
                  { 
                    id: "Remix", 
                    label: "Remix", 
                    icon: <Music className="w-4 h-4" />,
                    badge: contests.filter(c => c.category === "Remix").length.toString()
                  },
                  { 
                    id: "Vocal", 
                    label: "Vocal", 
                    icon: <Mic className="w-4 h-4" />,
                    badge: contests.filter(c => c.category === "Vocal").length.toString()
                  },
                  { 
                    id: "Lo-Fi", 
                    label: "Lo-Fi", 
                    icon: <Headphones className="w-4 h-4" />,
                    badge: contests.filter(c => c.category === "Lo-Fi").length.toString()
                  },
                  { 
                    id: "Electronic", 
                    label: "Electronic", 
                    icon: <Zap className="w-4 h-4" />
                  },
                  { 
                    id: "Hip-Hop", 
                    label: "Hip-Hop", 
                    icon: <Gamepad2 className="w-4 h-4" />
                  }
                ]}
                activeTab={selectedCategory}
                onTabChange={setSelectedCategory}
                variant="pills"
                size="sm"
                className="overflow-x-auto scrollbar-hide"
              />
            </div>

            {/* Active Contests */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat']">Active Contests</h3>
                <span className="text-[12px] text-[#8b949e] font-['Inter']">{filteredContests.length} contests</span>
              </div>
              
              <div className="space-y-4">
                {filteredContests.map((contest) => (
                  <button 
                    key={contest.id} 
                    onClick={() => onOpenContestDetail?.(contest)}
                    className="bg-[#21262d] border border-[#30363d] rounded-2xl p-4 w-full text-left hover:bg-[#30363d] transition-colors"
                  >
                    <div className="flex gap-4">
                      <div 
                        className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url('${contest.cover}')` }}
                      />
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-[16px] font-bold text-[#c9d1d9] font-['Inter']">{contest.title}</h4>
                            <div className={`px-2 py-1 rounded-[5px] text-[10px] font-bold text-white uppercase tracking-[0.5px] font-['Inter'] ${
                              contest.status === "Ending Soon" ? "bg-[#d29922]" : 
                              contest.status === "New" ? "bg-[#2ea043]" : "bg-[#6366f1]"
                            }`}>
                              {contest.status}
                            </div>
                          </div>
                          <p className="text-[12px] text-[#8b949e] font-['Inter'] mb-2">{contest.description}</p>
                          
                          <div className="flex items-center gap-3 text-[12px] text-[#8b949e] font-['Inter']">
                            <div className="flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              <span>{contest.prize}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{contest.timeLeft}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{contest.participants}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-[5px] text-[10px] font-bold uppercase tracking-[0.5px] font-['Inter'] ${
                              contest.difficulty === "Beginner" ? "bg-[#2ea043] text-white" :
                              contest.difficulty === "Intermediate" ? "bg-[#d29922] text-white" :
                              "bg-[#dc2626] text-white"
                            }`}>
                              {contest.difficulty}
                            </span>
                            <span className="text-[10px] text-[#8b949e] font-['Inter'] bg-[#161b22] px-2 py-1 rounded-[5px]">
                              {contest.category.toUpperCase()}
                            </span>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoinContest(contest.id);
                            }}
                            className={`px-4 py-2 rounded-[7px] text-[12px] font-bold transition-colors font-['Inter'] ${
                              joinedContests.has(contest.id)
                                ? "bg-[#2ea043] text-white"
                                : "bg-[#ff22fb] hover:bg-[#ff22fb]/90 text-white"
                            }`}
                          >
                            {joinedContests.has(contest.id) ? "Joined" : "Join"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contest Stats */}
            <div className="bg-[#21262d] rounded-2xl p-4 mb-6">
              <h3 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat'] mb-4">Your Contest Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-[20px] font-bold text-[#ff22fb] font-['Inter']">
                    {joinedContests.size}
                  </div>
                  <div className="text-[12px] text-[#8b949e] font-['Inter']">Joined</div>
                </div>
                <div className="text-center">
                  <div className="text-[20px] font-bold text-[#2ea043] font-['Inter']">2</div>
                  <div className="text-[12px] text-[#8b949e] font-['Inter']">Won</div>
                </div>
                <div className="text-center">
                  <div className="text-[20px] font-bold text-[#d29922] font-['Inter']">5</div>
                  <div className="text-[12px] text-[#8b949e] font-['Inter']">Top 10</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat'] mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-[#21262d] hover:bg-[#30363d] p-4 rounded-xl transition-colors flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#ff22fb] rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-[14px] font-semibold text-[#c9d1d9] font-['Montserrat']">My Submissions</div>
                    <div className="text-[12px] text-[#8b949e] font-['Inter']">View & manage</div>
                  </div>
                </button>
                
                <button className="bg-[#21262d] hover:bg-[#30363d] p-4 rounded-xl transition-colors flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#ff4400] rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-[14px] font-semibold text-[#c9d1d9] font-['Montserrat']">Schedule</div>
                    <div className="text-[12px] text-[#8b949e] font-['Inter']">Upcoming events</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation activeTab="Contests" onNavigate={onNavigate || (() => {})} />
        </div>
      </div>
    </div>
  );
}