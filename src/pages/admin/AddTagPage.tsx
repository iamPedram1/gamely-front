import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

export default function AddTagPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create tag:", formData);
    // TODO: Implement tag creation
    navigate("/dashboard/tags");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/tags">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-black">
            <span className="gradient-gaming-text">Add</span> Tag
          </h1>
          <p className="text-muted-foreground mt-2">Create a new tag</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Tag Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Tag Name *</Label>
              <Input
                id="name"
                placeholder="e.g., RPG"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                placeholder="e.g., rpg"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="gradient-gaming glow-effect hover:glow-effect-strong font-semibold uppercase"
              >
                <Save className="h-4 w-4 mr-2" />
                Create Tag
              </Button>
              <Link to="/dashboard/tags">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
