import { useState } from "react";
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Calendar, 
  Users, 
  Trophy, 
  Clock, 
  Play, 
  Download, 
  Heart, 
  Share,
  CheckCircle,
  Upload,
  Star,
  Award,
  Music,
  Headphones,
  Eye,
  AlertCircle
} from "lucide-react";
import svgPaths from "../imports/svg-68u3b9ml9g";
import BottomNavigation from "./BottomNavigation";

// Import contest and submission images
import imgContestCover from "figma:asset/92af5e42f7a6be5cc4a3570d7557d9b846376457.png";
import imgSubmission1 from "figma:asset/b4d5d93e0e03aef0e9252522600b2fe91d9305c2.png";
import imgSubmission2 from "figma:asset/2445cdb838670e8ea661ef232b16e90503fdec0b.png";
import imgSubmission3 from "figma:asset/f6899fe4451eb26d22ac13df75a794b76f152b36.png";
import imgUserAvatar1 from "figma:asset/02641910bdc93d1d98cf6da313c9fe42f75a5679.png";
import imgUserAvatar2 from "figma:asset/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png";
import imgUserAvatar3 from "figma:asset/942f88b3ac884230b9cb4196019616c8ea6fb6a0.png";

interface Submission {
  id: string;
  title: string;
  artist: string;
  avatar: string;
  cover: string;
  likes: number;
  plays: number;
  rank: number;
  isLiked?: boolean;
}

interface ContestDetailProps {
  onBack?: () => void;
  onNavigate?: (tab: string) => void;
  onOpenRankingDetail?: (rankingId: string, category: 'remixers' | 'performers' | 'tracks' | 'genres') => void;
  activeTab?: string;
  contestId?: string;
}

export default function ContestDetail({ onBack, onNavigate, onOpenRankingDetail, activeTab = "Contests", contestId = "beat-drop-challenge" }: ContestDetailProps) {
  const [hasJoined, setHasJoined] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [likedSubmissions, setLikedSubmissions] = useState(new Set<string>());

  const contest = {
    id: contestId,
    title: "Beat Drop Challenge",
    description: "Create the most innovative beat drop using our provided samples. Show your creativity and technical skills in this exciting production challenge.",
    cover: imgContestCover,
    prize: "$5,000 + Recording Contract",
    timeLeft: "3 days left",
    deadline: "Dec 15, 2024",
    participants: 1247,
    submissions: 856,
    category: "Electronic",
    difficulty: "Intermediate",
    status: "Active",
    rules: [
      "Use at least 3 of the provided sample packs",
      "Track must be between 3-6 minutes long",
      "Original compositions only",
      "Submit in WAV format (24-bit/44.1kHz minimum)",
      "Include project file (Ableton, FL Studio, etc.)"
    ],
    prizes: [
      { rank: "1st Place", award: "$5,000 + Recording Contract + Featured Playlist", color: "#FFD700" },
      { rank: "2nd Place", award: "$2,500 + Studio Session + Mentorship", color: "#C0C0C0" },
      { rank: "3rd Place", award: "$1,000 + Sample Pack Bundle", color: "#CD7F32" },
      { rank: "Top 10", award: "Exclusive Discord Access + Feedback", color: "#ff22fb" }
    ]
  };

  const submissions: Submission[] = [
    {
      id: "sub1",
      title: "Cosmic Synthwave Drop",
      artist: "BeatMaster",
      avatar: imgUserAvatar1,
      cover: imgSubmission1,
      likes: 342,
      plays: 1847,
      rank: 1
    },
    {
      id: "sub2", 
      title: "Neon Pulse Explosion",
      artist: "SynthDreamer",
      avatar: imgUserAvatar2,
      cover: imgSubmission2,
      likes: 298,
      plays: 1456,
      rank: 2
    },
    {
      id: "sub3",
      title: "Digital Thunder",
      artist: "GrooveGuru",
      avatar: imgUserAvatar3,
      cover: imgSubmission3,
      likes: 267,
      plays: 1289,
      rank: 3
    }
  ];

  const handleJoinContest = () => {
    setHasJoined(!hasJoined);
  };

  const handleSubmitEntry = () => {
    setHasSubmitted(true);
  };

  const toggleLikeSubmission = (submissionId: string) => {
    const newLiked = new Set(likedSubmissions);
    if (newLiked.has(submissionId)) {
      newLiked.delete(submissionId);
    } else {
      newLiked.add(submissionId);
    }
    setLikedSubmissions(newLiked);
  };

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
            <h2 className="text-[18px] font-semibold text-[#c9d1d9] font-['Montserrat']">Contest Details</h2>
            <button className="text-[#c9d1d9] hover:text-[#ff22fb] transition-colors">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 pb-32">
            {/* Contest Hero Section */}
            <div className="mb-8">
              <div className="relative bg-[#484f58] rounded-2xl h-[240px] overflow-hidden mb-6">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${contest.cover}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000dd] via-[#00000033] to-[#00000000]" />
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-[#2ea043] px-3 py-1 rounded-full text-[12px] font-bold text-white font-['Inter']">
                    {contest.status.toUpperCase()}
                  </div>
                </div>

                {/* Contest Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h1 className="text-[24px] font-bold text-white font-['Inter'] mb-2">{contest.title}</h1>
                  <p className="text-[14px] text-[rgba(255,255,255,0.9)] font-['Inter'] mb-4 leading-relaxed">
                    {contest.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4 text-[rgba(255,255,255,0.9)]">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      <span className="text-[12px] font-bold font-['Inter']">{contest.prize}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-[12px] font-bold font-['Inter']">{contest.timeLeft}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contest Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#21262d] rounded-xl p-4 text-center">
                  <div className="text-[20px] font-bold text-[#ff22fb] font-['Inter']">{contest.participants}</div>
                  <div className="text-[12px] text-[#8b949e] font-['Inter']">Participants</div>
                </div>
                <div className="bg-[#21262d] rounded-xl p-4 text-center">
                  <div className="text-[20px] font-bold text-[#2ea043] font-['Inter']">{contest.submissions}</div>
                  <div className="text-[12px] text-[#8b949e] font-['Inter']">Submissions</div>
                </div>
                <div className="bg-[#21262d] rounded-xl p-4 text-center">
                  <div className="text-[20px] font-bold text-[#d29922] font-['Inter']">3</div>
                  <div className="text-[12px] text-[#8b949e] font-['Inter']">Days Left</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                {!hasJoined ? (
                  <button
                    onClick={handleJoinContest}
                    className="bg-[#ff22fb] hover:bg-[#e91e63] px-6 py-3 rounded-[7px] flex-1 text-[14px] font-bold text-white transition-colors font-['Inter'] flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-5 h-5" />
                    Join Contest
                  </button>
                ) : !hasSubmitted ? (
                  <button
                    onClick={handleSubmitEntry}
                    className="bg-[#2ea043] hover:bg-[#28a745] px-6 py-3 rounded-[7px] flex-1 text-[14px] font-bold text-white transition-colors font-['Inter'] flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Submit Entry
                  </button>
                ) : (
                  <div className="bg-[#30363d] px-6 py-3 rounded-[7px] flex-1 text-[14px] font-bold text-[#8b949e] font-['Inter'] flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Submitted
                  </div>
                )}
                
                <button className="bg-[#21262d] hover:bg-[#30363d] px-4 py-3 rounded-[7px] text-[#c9d1d9] transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                
                <button className="bg-[#21262d] hover:bg-[#30363d] px-4 py-3 rounded-[7px] text-[#c9d1d9] transition-colors">
                  <Share className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Section Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { id: "overview", label: "Overview" },
                { id: "rules", label: "Rules" },
                { id: "submissions", label: "Submissions" },
                { id: "prizes", label: "Prizes" }
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2 rounded-lg text-[12px] font-bold transition-colors font-['Inter'] whitespace-nowrap ${
                    activeSection === section.id
                      ? "bg-[#ff22fb] text-white"
                      : "bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-[#c9d1d9]"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Section Content */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                {/* Contest Details */}
                <div className="bg-[#21262d] rounded-xl p-4">
                  <h3 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat'] mb-3">Contest Information</h3>
                  <div className="space-y-3 text-[14px] font-['Inter']">
                    <div className="flex justify-between">
                      <span className="text-[#8b949e]">Category:</span>
                      <span className="text-[#c9d1d9]">{contest.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8b949e]">Difficulty:</span>
                      <span className="text-[#c9d1d9]">{contest.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8b949e]">Deadline:</span>
                      <span className="text-[#c9d1d9]">{contest.deadline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8b949e]">Host:</span>
                      <span className="text-[#c9d1d9]">Tunton Official</span>
                    </div>
                  </div>
                </div>

                {/* Sample Downloads */}
                <div className="bg-[#21262d] rounded-xl p-4">
                  <h3 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat'] mb-3">Sample Packs & Tracks</h3>
                  <div className="space-y-3">
                    {[
                      { 
                        name: "Drum Kit Vol. 1", 
                        size: "24.5 MB", 
                        downloads: 1205,
                        tracks: [
                          { name: "Kick_Heavy_01.wav", duration: "0:02", size: "1.2 MB" },
                          { name: "Snare_Crisp_02.wav", duration: "0:01", size: "0.8 MB" },
                          { name: "Hi-Hat_Sharp_03.wav", duration: "0:01", size: "0.5 MB" },
                          { name: "Crash_Epic_04.wav", duration: "0:03", size: "2.1 MB" }
                        ]
                      },
                      { 
                        name: "Synth Loops Pack", 
                        size: "45.2 MB", 
                        downloads: 982,
                        tracks: [
                          { name: "Bass_Loop_120bpm.wav", duration: "0:08", size: "4.2 MB" },
                          { name: "Lead_Melody_Am.wav", duration: "0:16", size: "8.1 MB" },
                          { name: "Pad_Ambient_Long.wav", duration: "0:32", size: "15.3 MB" },
                          { name: "Arp_Sequence_Fast.wav", duration: "0:04", size: "2.8 MB" }
                        ]
                      },
                      { 
                        name: "Vocal Chops", 
                        size: "18.7 MB", 
                        downloads: 756,
                        tracks: [
                          { name: "Vocal_Chop_01.wav", duration: "0:02", size: "1.5 MB" },
                          { name: "Vocal_Harmony_02.wav", duration: "0:04", size: "2.8 MB" },
                          { name: "Voice_Effect_03.wav", duration: "0:03", size: "2.1 MB" }
                        ]
                      }
                    ].map((pack, i) => (
                      <div key={i} className="bg-[#161b22] rounded-lg border border-[#30363d] overflow-hidden">
                        <div className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#ff22fb] rounded-lg flex items-center justify-center">
                              <Music className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-[14px] font-semibold text-[#c9d1d9] font-['Inter']">{pack.name}</h4>
                              <p className="text-[12px] text-[#8b949e] font-['Inter']">{pack.size} • {pack.downloads} downloads • {pack.tracks.length} tracks</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                const expandedPacks = document.querySelectorAll(`[data-pack="${i}"]`);
                                expandedPacks.forEach(pack => {
                                  pack.classList.toggle('hidden');
                                });
                              }}
                              className="bg-[#21262d] hover:bg-[#30363d] px-2 py-1 rounded text-[12px] font-bold text-[#8b949e] hover:text-[#c9d1d9] transition-colors font-['Inter']"
                            >
                              Tracks
                            </button>
                            <button className="bg-[#ff22fb] hover:bg-[#e91e63] px-3 py-2 rounded-lg text-[12px] font-bold text-white transition-colors font-['Inter'] flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        </div>
                        
                        {/* Track List */}
                        <div data-pack={i} className="hidden border-t border-[#30363d] bg-[#0d1117]">
                          <div className="p-3 space-y-2">
                            {pack.tracks.map((track, trackIndex) => (
                              <div key={trackIndex} className="flex items-center justify-between p-2 hover:bg-[#161b22] rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                  <button className="w-8 h-8 bg-[#ff22fb] hover:bg-[#e91e63] rounded-full flex items-center justify-center transition-colors">
                                    <Play className="w-3 h-3 text-white ml-0.5" />
                                  </button>
                                  <div>
                                    <div className="text-[12px] font-semibold text-[#c9d1d9] font-['Inter']">{track.name}</div>
                                    <div className="text-[10px] text-[#8b949e] font-['Inter']">{track.duration} • {track.size}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button className="text-[#8b949e] hover:text-[#ff22fb] transition-colors">
                                    <Headphones className="w-4 h-4" />
                                  </button>
                                  <button className="text-[#8b949e] hover:text-[#ff22fb] transition-colors">
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "rules" && (
              <div className="bg-[#21262d] rounded-xl p-4">
                <h3 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat'] mb-4">Contest Rules</h3>
                <div className="space-y-3">
                  {contest.rules.map((rule, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#ff22fb] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[12px] font-bold text-white">{i + 1}</span>
                      </div>
                      <p className="text-[14px] text-[#c9d1d9] font-['Inter'] leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-[#161b22] rounded-lg border border-[#ff4400]">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#ff4400] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[14px] font-semibold text-[#ff4400] font-['Inter'] mb-1">Important Notice</h4>
                      <p className="text-[12px] text-[#8b949e] font-['Inter'] leading-relaxed">
                        All submissions will be reviewed for originality. Plagiarism or copyright infringement will result in immediate disqualification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "submissions" && (
              <div className="space-y-4">
                {/* Live Leaderboard */}
                <div className="bg-[#21262d] rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat']">Live Contest Leaderboard</h3>
                    <button 
                      onClick={() => onNavigate?.("Ranking")}
                      className="text-[12px] text-[#ff22fb] font-['Inter'] hover:text-[#ff22fb]/80"
                    >
                      View Full Rankings
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {submissions.slice(0, 3).map((submission, index) => (
                      <div key={submission.id} className="flex items-center justify-between p-2 bg-[#161b22] rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            submission.rank === 1 ? 'bg-[#FFD700]' : 
                            submission.rank === 2 ? 'bg-[#C0C0C0]' : 
                            'bg-[#CD7F32]'
                          }`}>
                            {submission.rank}
                          </div>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-full bg-cover bg-center"
                              style={{ backgroundImage: `url('${submission.avatar}')` }}
                            />
                            <div>
                              <p className="text-[12px] font-semibold text-[#c9d1d9] font-['Inter']">{submission.artist}</p>
                              <p className="text-[10px] text-[#8b949e] font-['Inter']">{submission.likes} votes</p>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => onOpenRankingDetail?.(submission.artist.toLowerCase(), 'remixers')}
                          className="text-[10px] bg-[#ff22fb] text-white px-2 py-1 rounded font-['Inter'] hover:bg-[#ff22fb]/90"
                        >
                          View Profile
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat']">Top Submissions</h3>
                  <span className="text-[12px] text-[#8b949e] font-['Inter']">{submissions.length} of {contest.submissions}</span>
                </div>
                
                {submissions.map((submission) => (
                  <div key={submission.id} className="bg-[#21262d] border border-[#30363d] rounded-xl p-4">
                    <div className="flex gap-4">
                      <div 
                        className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url('${submission.cover}')` }}
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-[14px] font-semibold text-[#c9d1d9] font-['Inter']">{submission.title}</h4>
                              <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white font-['Inter'] ${
                                submission.rank === 1 ? "bg-[#FFD700]" :
                                submission.rank === 2 ? "bg-[#C0C0C0]" :
                                submission.rank === 3 ? "bg-[#CD7F32]" : "bg-[#ff22fb]"
                              }`}>
                                #{submission.rank}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <div 
                                className="w-5 h-5 rounded-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${submission.avatar}')` }}
                              />
                              <span className="text-[12px] text-[#8b949e] font-['Inter']">by {submission.artist}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-[12px] text-[#8b949e] font-['Inter']">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span>{submission.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Headphones className="w-3 h-3" />
                            <span>{submission.plays}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="bg-[#ff22fb] hover:bg-[#e91e63] px-3 py-1.5 rounded-lg text-[12px] font-bold text-white transition-colors font-['Inter'] flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            Play
                          </button>
                          
                          <button
                            onClick={() => toggleLikeSubmission(submission.id)}
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors font-['Inter'] flex items-center gap-1 ${
                              likedSubmissions.has(submission.id)
                                ? "bg-[#ff22fb] text-white"
                                : "bg-[#161b22] text-[#8b949e] hover:text-[#ff22fb]"
                            }`}
                          >
                            <Heart className="w-3 h-3" />
                            Like
                          </button>
                          
                          <button className="bg-[#161b22] hover:bg-[#30363d] px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#8b949e] hover:text-[#c9d1d9] transition-colors font-['Inter'] flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "prizes" && (
              <div className="space-y-4">
                {contest.prizes.map((prize, i) => (
                  <div key={i} className="bg-[#21262d] border border-[#30363d] rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: prize.color }}
                      >
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[16px] font-semibold text-[#c9d1d9] font-['Inter'] mb-1">{prize.rank}</h4>
                        <p className="text-[14px] text-[#8b949e] font-['Inter']">{prize.award}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation activeTab="Contests" onNavigate={onNavigate || (() => {})} />
        </div>
      </div>
    </div>
  );
}