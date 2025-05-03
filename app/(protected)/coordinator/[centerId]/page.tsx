import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUserSession } from '@/lib/auth';
import { Role, ClaimStatus } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FileText, Building2, Users, AlertCircle } from 'lucide-react';

type CoordinatorCenterPageProps = {
  params: {
    centerId: string;
  };
};

export async function generateMetadata({ params }: CoordinatorCenterPageProps): Promise<Metadata> {
  const center = await prisma.center.findUnique({
    where: { id: params.centerId },
    select: { name: true },
  });
  return {
    title: center ? `${center.name} Dashboard` : 'Center Dashboard',
    description: `Management dashboard for ${center?.name || 'your center'}`,
  };
}

export default async function CoordinatorCenterPage({ params }: CoordinatorCenterPageProps) {
  const { centerId } = params;
  const session = await getCurrentUserSession();

  // Authorization Check
  if (session?.role !== Role.COORDINATOR) {
    redirect('/dashboard');
  }

  const center = await prisma.center.findUnique({
    where: {
      id: centerId,
      coordinatorId: session.userId,
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          departments: true,
          lecturers: true,
          claims: { where: { status: ClaimStatus.PENDING } }
        }
      }
    }
  });

  if (!center) {
    redirect('/dashboard');
  }

  const stats = [
    {
      title: "Pending Claims",
      value: center._count.claims,
      icon: AlertCircle,
      link: `${centerId}/claims`,
      variant: center._count.claims > 0 ? "destructive" : "secondary",
      description: "Require your attention"
    },
    {
      title: "Departments",
      value: center._count.departments,
      icon: Building2,
      link: `${centerId}/departments`,
      variant: "secondary",
      description: "Under management"
    },
    {
      title: "Lecturers",
      value: center._count.lecturers,
      icon: Users,
      link: `${centerId}/lecturers`,
      variant: "secondary",
      description: "Assigned to center"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{center.name}</h1>
        <p className="text-muted-foreground mt-2">
          Center management dashboard and quick actions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.variant === "destructive" ? "text-destructive" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <p className="text-sm text-muted-foreground mb-4">{stat.description}</p>
              <Button 
                variant={stat.variant as "destructive" | "secondary"} 
                size="sm" 
                className="w-full" 
                asChild
              >
                <Link href={`/coordinator/${stat.link}`}>
                  Manage {stat.title.toLowerCase()}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Optional Recent Activity Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild variant="outline">
            <Link href={`/coordinator/${centerId}/claims`}>
              <FileText className="mr-2 h-4 w-4" />
              Review All Claims
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/coordinator/${centerId}/departments`}>
              <Building2 className="mr-2 h-4 w-4" />
              Department Settings
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/coordinator/${centerId}/lecturers`}>
              <Users className="mr-2 h-4 w-4" />
              Lecturer Directory
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}