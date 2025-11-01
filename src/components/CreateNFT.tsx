import { useState } from "react";
import { ArrowLeft, Upload, Info } from "lucide-react";
import { Button } from "./ui/button-component";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface CreateNFTProps {
  onBack: () => void;
  onCreateNFT: (nftData: {
    title: string;
    description: string;
    category: string;
    price: number;
    royalties: number;
    isAuction: boolean;
    auctionDuration?: number;
    file: File | null;
  }) => void;
}

export default function CreateNFT({ onBack, onCreateNFT }: CreateNFTProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    royalties: 10,
    isAuction: false,
    auctionDuration: 7,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const categories = [
    "Music",
    "Art",
    "Collectibles",
    "Rights",
    "Samples",
    "Stems"
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.category || !selectedFile) {
      alert("Please fill in all required fields");
      return;
    }

    onCreateNFT({
      ...formData,
      file: selectedFile,
    });
  };

  return (
    <div className="bg-[#0d1117] min-h-screen">
      <div className="max-w-md mx-auto bg-[#161b22] rounded-2xl overflow-y-auto pb-20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#30363d]">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6 text-[#c9d1d9]" />
          </button>
          <h1 className="text-[18px] font-semibold text-[#c9d1d9] font-['Montserrat']">Create NFT</h1>
          <div className="w-8" />
        </div>

        <div className="p-6 space-y-6">
          {/* File Upload */}
          <Card className="bg-[#0d1117] border-[#30363d]">
            <CardHeader>
              <CardTitle className="text-[16px] text-[#c9d1d9]">Upload File</CardTitle>
              <CardDescription className="text-[#8b949e]">
                Supported formats: MP3, WAV, FLAC, JPG, PNG, GIF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-[#30363d] rounded-lg p-6 text-center">
                {previewUrl ? (
                  <div className="space-y-4">
                    {selectedFile?.type.startsWith('image/') ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-40 bg-[#161b22] rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎵</div>
                          <p className="text-[#c9d1d9] font-semibold">{selectedFile?.name}</p>
                        </div>
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('fileInput')?.click()}
                      className="border-[#30363d] text-[#c9d1d9]"
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-[#8b949e] mx-auto" />
                    <div>
                      <p className="text-[#c9d1d9] font-semibold mb-1">Drop files here or click to browse</p>
                      <p className="text-[#8b949e] text-sm">Max file size: 100MB</p>
                    </div>
                    <Button 
                      onClick={() => document.getElementById('fileInput')?.click()}
                      className="bg-[#ff22fb] hover:bg-[#ff22fb]/90"
                    >
                      Choose File
                    </Button>
                  </div>
                )}
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*,audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="bg-[#0d1117] border-[#30363d]">
            <CardHeader>
              <CardTitle className="text-[16px] text-[#c9d1d9]">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-[#c9d1d9]">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter NFT title"
                  className="bg-[#161b22] border-[#30363d] text-[#c9d1d9]"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-[#c9d1d9]">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your NFT"
                  className="bg-[#161b22] border-[#30363d] text-[#c9d1d9] min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-[#c9d1d9]">Category *</Label>
                <Select onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-[#161b22] border-[#30363d] text-[#c9d1d9]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#161b22] border-[#30363d]">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-[#c9d1d9]">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Sale Settings */}
          <Card className="bg-[#0d1117] border-[#30363d]">
            <CardHeader>
              <CardTitle className="text-[16px] text-[#c9d1d9]">Sale Settings</CardTitle>
              <CardDescription className="text-[#8b949e]">
                Configure how you want to sell your NFT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#c9d1d9]">Auction</Label>
                  <p className="text-sm text-[#8b949e]">Allow bidding on your NFT</p>
                </div>
                <Switch
                  checked={formData.isAuction}
                  onCheckedChange={(checked) => setFormData({...formData, isAuction: checked})}
                />
              </div>

              {formData.isAuction ? (
                <div>
                  <Label htmlFor="auctionDuration" className="text-[#c9d1d9]">Auction Duration (days)</Label>
                  <Input
                    id="auctionDuration"
                    type="number"
                    value={formData.auctionDuration}
                    onChange={(e) => setFormData({...formData, auctionDuration: Number(e.target.value)})}
                    min="1"
                    max="30"
                    className="bg-[#161b22] border-[#30363d] text-[#c9d1d9]"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="price" className="text-[#c9d1d9]">Price (Stars)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    min="1"
                    placeholder="0"
                    className="bg-[#161b22] border-[#30363d] text-[#c9d1d9]"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="royalties" className="text-[#c9d1d9]">Royalties (%)</Label>
                  <Info className="w-4 h-4 text-[#8b949e]" />
                </div>
                <Input
                  id="royalties"
                  type="number"
                  value={formData.royalties}
                  onChange={(e) => setFormData({...formData, royalties: Number(e.target.value)})}
                  min="0"
                  max="50"
                  className="bg-[#161b22] border-[#30363d] text-[#c9d1d9]"
                />
                <p className="text-sm text-[#8b949e] mt-1">
                  You'll earn this percentage on all future sales
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Creation Fee Info */}
          <Card className="bg-[#ff22fb]/10 border-[#ff22fb]/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#ff22fb] mt-0.5" />
                <div>
                  <p className="text-[#c9d1d9] font-semibold mb-1">Creation Fee</p>
                  <p className="text-[#8b949e] text-sm">
                    A one-time creation fee of 50 Stars will be charged to mint your NFT on the blockchain.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Button */}
          <Button 
            onClick={handleSubmit}
            className="w-full bg-[#ff22fb] hover:bg-[#ff22fb]/90 py-3"
            disabled={!formData.title || !formData.category || !selectedFile}
          >
            Create NFT (50 ⭐)
          </Button>
        </div>
      </div>
    </div>
  );
}