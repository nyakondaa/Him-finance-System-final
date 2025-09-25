import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useOrganization } from '../context/OrganizationContext';
import { getStudents, getStudentById } from '../services/api';
import { BalanceSummary } from '../components/BalanceCard';
import { TransactionHistory } from '../components/TransactionHistory';

interface Student {
  id: number;
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber?: string;
  email?: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  grade?: string;
  class?: string;
  isActive: boolean;
  enrollmentDate: string;
  academicYear?: {
    id: number;
    name: string;
  };
  branch: {
    code: string;
    name: string;
  };
  _count: {
    feePayments: number;
    studentBalances: number;
  };
}

interface StudentDetail extends Student {
  feePayments: Array<{
    id: number;
    receiptNumber: string;
    amount: number;
    currencyCode: string;
    paymentDate: string;
    status: string;
    notes?: string;
    referenceNumber?: string;
    paymentMethod: {
      name: string;
    };
    processor: {
      firstName: string;
      lastName: string;
    };
    feeStructure: {
      name: string;
      feeCategory: {
        name: string;
      };
    };
  }>;
  studentBalances: Array<{
    id: number;
    balanceType: 'CREDIT' | 'DEBIT' | 'PLEDGE' | 'PREPAID';
    balance: number;
    currencyCode: string;
    lastUpdated: string;
    feeStructure?: {
      name: string;
      feeCategory: {
        name: string;
      };
    };
  }>;
  feeReminders: Array<{
    id: number;
    reminderType: string;
    dueDate: string;
    amount: number;
    currencyCode: string;
    status: string;
    feeStructure: {
      name: string;
      feeCategory: {
        name: string;
      };
    };
  }>;
  feeExemptions: Array<{
    id: number;
    exemptionType: string;
    amount?: number;
    percentage?: number;
    reason: string;
    startDate: string;
    endDate?: string;
    isActive: boolean;
    feeStructure: {
      name: string;
      feeCategory: {
        name: string;
      };
    };
    approver: {
      firstName: string;
      lastName: string;
    };
  }>;
}

export const StudentsPage: React.FC = () => {
  const { isSchool } = useOrganization();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');

  useEffect(() => {
    if (isSchool) {
      loadStudents();
    }
  }, [isSchool]);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (gradeFilter) params.grade = gradeFilter;
      if (classFilter) params.class = classFilter;
      
      const data = await getStudents(params);
      setStudents(data.students || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students');
      console.error('Error loading students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudentDetail = async (studentId: number) => {
    try {
      const student = await getStudentById(studentId);
      setSelectedStudent(student);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load student details');
      console.error('Error loading student details:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getGenderLabel = (gender?: string) => {
    switch (gender) {
      case 'MALE':
        return 'Male';
      case 'FEMALE':
        return 'Female';
      case 'OTHER':
        return 'Other';
      default:
        return 'Not specified';
    }
  };

  if (!isSchool) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-600">School Features Not Available</h2>
          <p className="text-gray-500 mt-2">
            This page is only available for school organizations.
          </p>
        </div>
      </div>
    );
  }

  if (selectedStudent) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => setSelectedStudent(null)}
            variant="outline"
          >
            ← Back to Students
          </Button>
          <h1 className="text-2xl font-bold">
            {selectedStudent.firstName} {selectedStudent.lastName}
          </h1>
          <Badge variant="outline">
            {selectedStudent.studentNumber}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-sm">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Student Number</label>
                  <p className="text-sm">{selectedStudent.studentNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Grade & Class</label>
                  <p className="text-sm">
                    {selectedStudent.grade || 'Not specified'} 
                    {selectedStudent.class && ` - ${selectedStudent.class}`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Academic Year</label>
                  <p className="text-sm">{selectedStudent.academicYear?.name || 'Not assigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Branch</label>
                  <p className="text-sm">{selectedStudent.branch.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-sm">{getGenderLabel(selectedStudent.gender)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Enrollment Date</label>
                  <p className="text-sm">{formatDate(selectedStudent.enrollmentDate)}</p>
                </div>
                {selectedStudent.parentName && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Parent/Guardian</label>
                    <p className="text-sm">{selectedStudent.parentName}</p>
                    {selectedStudent.parentPhone && (
                      <p className="text-sm text-gray-600">{selectedStudent.parentPhone}</p>
                    )}
                  </div>
                )}
                {selectedStudent.emergencyContact && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
                    <p className="text-sm">{selectedStudent.emergencyContact}</p>
                    {selectedStudent.emergencyPhone && (
                      <p className="text-sm text-gray-600">{selectedStudent.emergencyPhone}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Balance and Transaction Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Summary */}
            {selectedStudent.studentBalances.length > 0 && (
              <BalanceSummary
                balances={selectedStudent.studentBalances}
                title="Fee Balance Summary"
              />
            )}

            {/* Fee Reminders */}
            {selectedStudent.feeReminders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Fee Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedStudent.feeReminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{reminder.feeStructure.name}</p>
                          <p className="text-sm text-gray-600">{reminder.feeStructure.feeCategory.name}</p>
                          <p className="text-xs text-gray-500">
                            Due: {formatDate(reminder.dueDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: reminder.currencyCode,
                            }).format(reminder.amount)}
                          </p>
                          <Badge variant="outline">{reminder.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fee Exemptions */}
            {selectedStudent.feeExemptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Active Fee Exemptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedStudent.feeExemptions.map((exemption) => (
                      <div key={exemption.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{exemption.feeStructure.name}</p>
                          <Badge variant="outline">{exemption.exemptionType}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{exemption.reason}</p>
                        <p className="text-xs text-gray-500">
                          Approved by: {exemption.approver.firstName} {exemption.approver.lastName}
                        </p>
                        {exemption.amount && (
                          <p className="text-sm font-medium">
                            Amount: {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            }).format(exemption.amount)}
                          </p>
                        )}
                        {exemption.percentage && (
                          <p className="text-sm font-medium">
                            Percentage: {exemption.percentage}%
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transaction History */}
            {selectedStudent.feePayments.length > 0 && (
              <TransactionHistory
                transactions={selectedStudent.feePayments}
                title="Fee Payment History"
                showFilters={true}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <Button>Add Student</Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Grade</label>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Grades</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
                <option value="5">Grade 5</option>
                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <input
                type="text"
                placeholder="Class name..."
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={loadStudents} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      {isLoading ? (
        <div className="text-center py-8">
          <p>Loading students...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">Error: {error}</p>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No students found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card
              key={student.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => loadStudentDetail(student.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {student.firstName} {student.lastName}
                  </CardTitle>
                  <Badge variant="outline">
                    {student.studentNumber}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Grade:</span>
                    <span className="text-sm">{student.grade || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Class:</span>
                    <span className="text-sm">{student.class || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Academic Year:</span>
                    <span className="text-sm">{student.academicYear?.name || 'Not assigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Branch:</span>
                    <span className="text-sm">{student.branch.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Enrolled:</span>
                    <span className="text-sm">{formatDate(student.enrollmentDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Fee Payments:</span>
                    <span className="text-sm">{student._count.feePayments}</span>
                  </div>
                </div>
                {student.parentName && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-500">Parent/Guardian</p>
                    <p className="text-sm font-medium">{student.parentName}</p>
                    {student.parentPhone && (
                      <p className="text-sm text-gray-600">{student.parentPhone}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
