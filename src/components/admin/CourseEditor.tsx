import { useState, useEffect } from 'react';
import { useAdminData } from '@/hooks/useAdminData';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Trash2, GripVertical, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Question } from '@/types/database';

interface CourseEditorProps {
  courseId: string | null;
  onClose: () => void;
}

interface QuestionDraft {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

const CourseEditor = ({ courseId, onClose }: CourseEditorProps) => {
  const { user } = useAuthContext();
  const { createCourse, updateCourse, deleteCourse, saveQuestions, getQuestions, getCourse } = useAdminData();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Course form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('General');
  const [passPercentage, setPassPercentage] = useState(70);
  const [isActive, setIsActive] = useState(true);

  // Questions state
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);

  // Load existing course data
  useEffect(() => {
    const loadCourse = async () => {
      if (courseId) {
        setIsLoading(true);
        
        // Fetch course directly from database
        const { data: course } = await getCourse(courseId);
        
        if (course) {
          setTitle(course.title);
          setDescription(course.description || '');
          setVideoUrl(course.video_url || '');
          setDuration(course.duration || '');
          setCategory(course.category);
          setPassPercentage(course.pass_percentage);
          setIsActive(course.is_active);

          const { data: questionsData } = await getQuestions(courseId);
          if (questionsData) {
            setQuestions(
              questionsData.map((q) => ({
                id: q.id,
                question_text: q.question_text,
                options: q.options,
                correct_answer: q.correct_answer,
                explanation: q.explanation || '',
              }))
            );
          }
        }
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId, getCourse, getQuestions]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        explanation: '',
      },
    ]);
  };

  const updateQuestion = (index: number, updates: Partial<QuestionDraft>) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...updates } : q))
    );
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? { ...q, options: q.options.map((o, j) => (j === optionIndex ? value : o)) }
          : q
      )
    );
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a course title');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        toast.error(`Question ${i + 1} is missing text`);
        return;
      }
      if (q.options.some((o) => !o.trim())) {
        toast.error(`Question ${i + 1} has empty options`);
        return;
      }
    }

    setIsSaving(true);

    try {
      const courseData = {
        title,
        description,
        video_url: videoUrl || null,
        duration: duration || null,
        category,
        pass_percentage: passPercentage,
        is_active: isActive,
        created_by: user?.id,
      };

      let savedCourseId = courseId;

      if (courseId) {
        const { error } = await updateCourse(courseId, courseData);
        if (error) throw error;
      } else {
        const { data, error } = await createCourse(courseData);
        if (error) throw error;
        savedCourseId = data.id;
      }

      // Save questions
      if (savedCourseId && questions.length > 0) {
        const questionsToSave = questions.map((q, index) => ({
          course_id: savedCourseId!,
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation || null,
          order_index: index,
        }));

        const { error } = await saveQuestions(savedCourseId, questionsToSave);
        if (error) throw error;
      }

      toast.success(courseId ? 'Course updated successfully' : 'Course created successfully');
      onClose();
    } catch (error: any) {
      toast.error('Failed to save course', { description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!courseId) return;

    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    setIsSaving(true);
    const { error } = await deleteCourse(courseId);

    if (error) {
      toast.error('Failed to delete course', { description: error.message });
    } else {
      toast.success('Course deleted successfully');
      onClose();
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{courseId ? 'Edit Course' : 'Create Course'}</h1>
            <p className="text-muted-foreground">
              {courseId ? 'Update course details and questions' : 'Add a new course for employees'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {courseId && (
            <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button
            className="gradient-primary text-primary-foreground"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Course
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>Basic information about the course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter course title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter course description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">Video URL</Label>
                <Input
                  id="video"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 25 min"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Onboarding">Onboarding</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                      <SelectItem value="Professional Development">Professional Development</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pass">Pass Percentage</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="pass"
                    type="number"
                    min={0}
                    max={100}
                    value={passPercentage}
                    onChange={(e) => setPassPercentage(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <div>
                  <p className="font-medium">Active</p>
                  <p className="text-sm text-muted-foreground">Show this course to employees</p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Assessment Questions</CardTitle>
                <CardDescription>Add MCQ questions for the course test</CardDescription>
              </div>
              <Button onClick={addQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <p className="text-muted-foreground">No questions added yet</p>
                  <Button variant="outline" className="mt-4" onClick={addQuestion}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Question
                  </Button>
                </div>
              ) : (
                questions.map((question, qIndex) => (
                  <div key={question.id} className="rounded-lg border p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <GripVertical className="mt-2 h-5 w-5 text-muted-foreground cursor-move" />
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Question {qIndex + 1}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => removeQuestion(qIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <Input
                          value={question.question_text}
                          onChange={(e) => updateQuestion(qIndex, { question_text: e.target.value })}
                          placeholder="Enter question text"
                        />

                        <div className="space-y-2">
                          <Label>Options (select correct answer)</Label>
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`question-${qIndex}`}
                                checked={question.correct_answer === oIndex}
                                onChange={() => updateQuestion(qIndex, { correct_answer: oIndex })}
                                className="h-4 w-4 text-primary"
                              />
                              <Input
                                value={option}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                placeholder={`Option ${oIndex + 1}`}
                                className="flex-1"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <Label>Explanation (optional)</Label>
                          <Textarea
                            value={question.explanation}
                            onChange={(e) => updateQuestion(qIndex, { explanation: e.target.value })}
                            placeholder="Explain why this answer is correct"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
