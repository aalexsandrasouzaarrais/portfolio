using System;

namespace TestedeMesa02
{
    class Program
    {
        static void Main(string[] args)
        {
            int a = 2;
            int[] v = new int[6];

            while (a < 6)
            {
                v[a] = a * 10;
                Console.WriteLine(v[a]);
                a += 1;
            }

        }

    }

}